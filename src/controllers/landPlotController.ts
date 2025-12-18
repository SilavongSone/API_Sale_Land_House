// controllers/landPlotController.ts
import { Request, Response } from "express";
import LandPlot from "../models/LandPlot";
import Zone from "../models/Zone";
import Project from "../models/Project";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

interface QueryParams {
  limit?: string;
  page?: string;
  skip?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
  zoneId?: string;
  status?: string;
  projectId?: string;
  includeProject?: "true" | "false";
  includeSales?: "true" | "false";
  includeZone?: "true" | "false";
}

export const getAllLandPlots = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<Response> => {
  try {
    const { limit, skip, orderBy = "landPlotId", order = "ASC", page } = parsePagination(req.query);

    const whereConditions: any = {};
    if (req.query.zoneId) {
      whereConditions.zoneId = parseInt(req.query.zoneId, 10);
    }

    if (req.query.status) {
      const status = req.query.status.toUpperCase();
      if (["AVAILABLE", "RESERVED", "SOLD"].includes(status)) {
        whereConditions.status = status;
      }
    }

    const includes: any[] = [];

    if (req.query.includeZone !== "false") {
      const zoneInclude: any = {
        model: Zone,
        as: "zone",
        attributes: ["zoneId", "zoneName", "projectId"], // include projectId
        include: [],
      };

      // Filter zones by projectId if provided
      if (req.query.projectId) {
        zoneInclude.where = { projectId: parseInt(req.query.projectId, 10) };
      }

      // Always include Project info
      zoneInclude.include.push({
        model: Project,
        as: "project",
        attributes: ["projectId", "projectName"], // include project name
      });

      includes.push(zoneInclude);
    }


    const { rows: landPlots, count: totalLandPlots } = await LandPlot.findAndCountAll({
      where: whereConditions,
      include: includes,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      distinct: true, // needed if includes may produce duplicates
    });

    return res.status(200).json({
      data: landPlots,
      pagination: buildPaginationResponse(totalLandPlots, limit, page),
    });
  } catch (error: any) {
    console.error("GetAllLandPlots Error:", error);
    return res.status(500).json({
      message: "Error fetching land plots",
      error: error?.message || String(error),
    });
  }
};

export const getLandPlotById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const landPlot = await LandPlot.findByPk(id, {
      include: [
        {
          model: Zone,
          as: "zone",
          attributes: ["zoneId", "zoneName", "projectId"],
          include: [
            {
              model: Project,
              as: "project",
              attributes: ["projectId", "projectName"],
            },
          ],
        },
      ],
    });

    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }

    return res.status(200).json({ data: landPlot });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching land plot",
      error: error?.message || String(error),
    });
  }
};


export const createLandPlot = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = req.body;
    const newLandPlot = await LandPlot.create(data);
    return res.status(201).json({ data: newLandPlot });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error creating land plot",
      error: error?.message || String(error),
    });
  }
};

export const updateLandPlot = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const landPlot = await LandPlot.findByPk(id);

    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }

    await landPlot.update(req.body);
    return res.status(200).json({ data: landPlot });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating land plot",
      error: error?.message || String(error),
    });
  }
};

export const deleteLandPlot = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const landPlot = await LandPlot.findByPk(id);

    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }

    await landPlot.destroy();
    return res.status(200).json({ message: "Land plot deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting land plot",
      error: error?.message || String(error),
    });
  }
};
