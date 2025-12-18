
// controllers/zoneController.ts
import { Request, Response } from "express";
import Zone from "../models/Zone";
import Project from "../models/Project";
import LandPlot from "../models/LandPlot";
import House from "../models/House";
import Sale from "../models/Sale";
// import { Op } from "sequelize";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

interface QueryParams {
  limit?: string;
  page?: string;
  skip?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
  search?: string;
  projectId?: string;
  landPlotId?: string;
  houseId?: string;
  status?: string;
  includeProject?: "true" | "false";
  includeLandPlots?: "true" | "false";
  includeHouses?: "true" | "false";
  includeSales?: "true" | "false";
}

export const getAllZones = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<Response> => {
  try {
    // Pagination - now includes 'page' in the destructuring
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    // Build where conditions
    const whereConditions: any = {};
    if (req.query.projectId) {
      whereConditions.projectId = parseInt(req.query.projectId, 10);
    }
    if (req.query.landPlotId) {
      whereConditions.LandPlotId = parseInt(req.query.landPlotId, 10);
    }
    if (req.query.houseId) {
      whereConditions.HouseId = parseInt(req.query.houseId, 10);
    }
    if (req.query.status) {
      const status = req.query.status.toUpperCase();
      if (["ACTIVE", "INACTIVE"].includes(status)) {
        whereConditions.status = status;
      }
    }

    // Build includes dynamically
    const includes: any[] = [];

    if (req.query.includeProject !== "false") {
      includes.push({
        model: Project,
        as: "project",
        attributes: ["projectId", "projectName"], // ເລືອກແຕ່ບາງ field
      });
    }
    // if (req.query.includeLandPlots !== "false") {
    //   includes.push({ model: LandPlot, as: "landPlots" });
    // }
    // if (req.query.includeHouses !== "false") {
    //   includes.push({ model: House, as: "houses" });
    // }
    // if (req.query.includeSales !== "false") {
    //   includes.push({ model: Sale, as: "sales" });
    // }

    // Execute query with pagination
    const { rows: zones, count: totalZones } = await Zone.findAndCountAll({
      where: whereConditions,
      include: includes,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      distinct: true,
    });

    // Return response with CORRECT parameter order: (total, limit, page)
    return res.status(200).json({
      data: zones,
      pagination: buildPaginationResponse(totalZones, limit, page),
    });
  } catch (error: any) {
    console.error("GetAllZones Error:", error);
    return res.status(500).json({
      message: "Error fetching zones",
      error: error?.message || String(error),
    });
  }
};


// export const getOption = async (
//   req: Request<{}, {}, {}, QueryParams>,
//   res: Response
// ) => {
//   try {
//     const search = req.query.search || "";

//     const zone = await Zone.findAll({
//       where: {
//         status: "ACTIVE",

//       },
//       attributes: ["zoneId", "totalLandArea"],
//       order: [["zoneName", "ASC"]],
//       include: [{
//         model: LandPlot, as: "landPlots",
//         attributes: ["landPlotId", "landArea"],
//       }],
//     });

//     return res.status(200).json({ data: zone });
//   } catch (error: any) {
//     return res.status(500).json({
//       message: "Error fetching projects",
//       error: error?.message || String(error),
//     });
//   }
// };


export const getZoneById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByPk(id, {
      include: ["project", "landPlots", "houses", "sales"],
    });

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    return res.status(200).json({ data: zone });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching zone",
      error: error?.message || String(error),
    });
  }
};

const generateZoneCode = async (): Promise<string> => {

  const lastZone = await Zone.findOne({
    order: [["zoneId", "DESC"]],
  });

  let lastNumber = 0;
  if (lastZone && lastZone.zoneCode) {
    const match = lastZone.zoneCode.match(/\d+$/);
    if (match) lastNumber = parseInt(match[0], 10);
  }

  const newNumber = lastNumber + 1;
  const newCode = `ZONE${newNumber.toString().padStart(4, "0")}`; // ZONE0001, ZONE0002
  return newCode;
};

export const createZone = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = req.body;
    data.zoneCode = await generateZoneCode();
    const newZone = await Zone.create(data);
    return res.status(201).json({ data: newZone });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating zone",
      error: error?.message || String(error),
    });
  }
};

export const updateZone = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    await zone.update(req.body);
    return res.status(200).json({ data: zone });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating zone",
      error: error?.message || String(error),
    });
  }
};

export const deleteZone = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByPk(id);

    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }

    await zone.destroy();
    return res.status(200).json({ message: "Zone deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting zone",
      error: error?.message || String(error),
    });
  }
};