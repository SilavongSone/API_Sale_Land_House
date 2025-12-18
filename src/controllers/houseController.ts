
import { Request, Response, RequestHandler } from "express";
import House from "../models/House";
import Zone from "../models/Zone";
import Sale from "../models/Sale";
import Maintenance from "../models/Maintenance";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";


interface QueryParams {
  projectId?: string;
  limit?: string;
  page?: string;
  skip?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
  zoneId?: string;
  houseType?: string;
  status?: string;
  furnitureStatus?: string;
  minPrice?: string;
  maxPrice?: string;
  minBedrooms?: string;
  maxBedrooms?: string;
  includeProject?: "true" | "false";
  includeZone?: "true" | "false";
  includeSales?: "true" | "false";
  includeMaintenances?: "true" | "false";
}


export const getAllHouses: RequestHandler<{}, {}, {}, QueryParams> = async (req, res) => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    const whereConditions: any = {};

    if (req.query.zoneId) whereConditions.zoneId = parseInt(req.query.zoneId, 10);
    if (req.query.houseType) whereConditions.houseType = req.query.houseType;

    if (req.query.status) {
      const status = req.query.status.toUpperCase();
      if (["AVAILABLE", "SOLD", "RESERVED"].includes(status)) whereConditions.status = status;
    }

    // Build includes dynamically

    const includes: any[] = [];

    if (req.query.projectId) {
      includes.push({
        model: Zone,
        as: "zone",
        attributes: ["zoneId", "zoneName",],
        where: { projectId: parseInt(req.query.projectId, 10) },
      });
    } else if (req.query.includeZone !== "false") {
      includes.push({ model: Zone, as: "zone" });
    }

    // if (req.query.includeSales !== "false") {
    //   includes.push({ model: Sale, as: "sales" });
    // }

    // if (req.query.includeMaintenances !== "false") {
    //   includes.push({ model: Maintenance, as: "maintenances" });
    // }


    // Execute query with pagination
    const { rows: houses, count: totalHouses } = await House.findAndCountAll({
      where: whereConditions,
      include: includes,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      distinct: true,
    });

    // Return response with CORRECT parameter order: (total, limit, page)
    return res.status(200).json({
      data: houses,
      pagination: buildPaginationResponse(totalHouses, limit, page),
    });
  } catch (error: any) {
    console.error("GetAllHouses Error:", error);
    return res.status(500).json({
      message: "Error fetching houses",
      error: error?.message || String(error),
    });
  }
};

// export const getOption = async (
//   req: Request<{}, {}, {}, QueryParams>,
//   res: Response
// ) => {
//   try {
//     // const search = req.query.search || "";

//     const house = await House.findAll({
//       where: {
//         status: "ACTIVE",
//         // ...(search && {
//         //   zoneName: { [Op.like]: `%${search}%` }, 
//         // }),
//       },
//       attributes: ["zoneId", "zoneName"],
//       order: [["zoneName", "ASC"]],
//     });

//     return res.status(200).json({ data: zone });
//   } catch (error: any) {
//     return res.status(500).json({
//       message: "Error fetching projects",
//       error: error?.message || String(error),
//     });
//   }
// };

export const getHouseById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const house = await House.findByPk(id, {
      include: ["zone", "sales", "maintenances"],
    });

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    return res.status(200).json({ data: house });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching house",
      error: error?.message || String(error),
    });
  }
};

export const createHouse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = req.body;
    const newHouse = await House.create(data);
    return res.status(201).json({ data: newHouse });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating house",
      error: error?.message || String(error),
    });
  }
};

export const updateHouse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const house = await House.findByPk(id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    await house.update(req.body);
    return res.status(200).json({ data: house });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating house",
      error: error?.message || String(error),
    });
  }
};

export const deleteHouse = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const house = await House.findByPk(id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    await house.destroy();
    return res.status(200).json({ message: "House deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting house",
      error: error?.message || String(error),
    });
  }
};