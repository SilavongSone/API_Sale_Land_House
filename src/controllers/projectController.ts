// controllers/projectController.ts
import { Request, Response } from "express";
import Project from "../models/Project";
import Province from "../models/Province";
import District from "../models/District";
import Zone from "../models/Zone";
import Expense from "../models/Expense";
// import { Op } from "sequelize";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

interface QueryParams {
  order?: "ASC" | "DESC";
  search?: string;
  projectType?: string;
  provinceId?: string;
  districtId?: string;
  status?: string;
  includeZones?: string;
  includeExpenses?: string;
}

export const getAllProjects = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
): Promise<Response> => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    // Build where conditions
    const whereConditions: any = {};

    // Status filter
    if (req.query.status) {
      const status = req.query.status.toUpperCase();
      if (["ACTIVE", "INACTIVE"].includes(status)) {
        whereConditions.status = status;
      }
    }

    // District filter - has priority over province filter
    if (req.query.districtId) {
      whereConditions.districtId = parseInt(req.query.districtId, 10);
    } else if (req.query.provinceId) {
      // Province filter (only if districtId is not provided)
      whereConditions["$district.provinceId$"] = parseInt(
        req.query.provinceId,
        10
      );
    }

    // Build includes array
    const includes: any[] = [
      {
        model: District,
        as: "district",
        attributes: ["districtId", "districtName", "provinceId"],
        required: !!req.query.provinceId && !req.query.districtId,
        include: [
          {
            model: Province,
            as: "province",
            attributes: ["provinceId", "provinceName"],
          },
        ],
      },
    ];

    // Optionally include zones and expenses
    if (req.query.includeZones !== "false") {
      includes.push({
        model: Zone,
        as: "zones",
        attributes: [
          "zoneId",
          "zoneName",
          "zoneType",
          "totalLandArea",
          "pricePerSqm",
        ],
        include: [
          // ตัวอย่าง ถ้ามี LandPlot
          // { model: LandPlot, as: "landPlots" },

          // ถ้ามี House
          // { model: House, as: "houses" },
        ],
      });
    }


    if (req.query.includeExpenses !== "false") {
      includes.push({ model: Expense, as: "expenses" });
    }

    // Execute query
    const { rows: projects, count: totalProjects } =
      await Project.findAndCountAll({
        where: whereConditions,
        include: includes,
        limit,
        offset: skip,
        order: [[orderBy, order]],
        distinct: true,
      });

    return res.status(200).json({
      data: projects,
      pagination: buildPaginationResponse(totalProjects, limit, page),
    });
  } catch (error: any) {
    console.error("GetAllProjects Error:", error);
    return res.status(500).json({
      message: "Error fetching projects",
      error: error?.message || String(error),
    });
  }
};



export const getOption = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response
) => {
  try {
    // const search = req.query.search || "";

    const projects = await Project.findAll({
      where: { status: "ACTIVE" },
      attributes: ["projectId", "projectName", "totalLandArea"],
      include: [
        {
          model: Zone,
          as: "zones",
          attributes: ["zoneId", "zoneName", "totalLandArea", "zoneType", "pricePerSqm",],
        }
      ],
      order: [["projectName", "ASC"]],
    });


    return res.status(200).json({ data: projects });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching projects",
      error: error?.message || String(error),
    });
  }
};


export const getProjectById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: ["district", "zones", "expenses"],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ data: project });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error fetching project",
      error: error?.message || String(error),
    });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("Create Project Payload:", data); // log payload
    const newProject = await Project.create(data);
    return res.status(201).json({ data: newProject });
  } catch (error: any) {
    console.error("Sequelize Error:", error); // log full error
    return res.status(500).json({
      message: "Error creating project",
      error: error?.message || String(error),
    });
  }
};


export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.update(req.body);
    return res.status(200).json({ data: project });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error updating project",
      error: error?.message || String(error),
    });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.destroy();
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Error deleting project",
      error: error?.message || String(error),
    });
  }
};