import { Request, Response } from "express";
import Staff from "../models/Staff";
import { District, Province, Sale, } from "../models";
import { parsePagination, buildPaginationResponse } from "../utils/pagination";

export const getAllStaffs = async (req: Request, res: Response) => {
  try {
    const { limit, skip, orderBy, order, page } = parsePagination(req.query);

    // Build filters
    const whereStaff: any = {};
    if (req.query.staffCode) whereStaff.staffCode = req.query.staffCode;
    if (req.query.position) whereStaff.position = req.query.position;
    if (req.query.department) whereStaff.department = req.query.department;
    if (req.query.status) whereStaff.status = req.query.status;

    const whereDistrict: any = {};
    if (req.query.provinceId) whereDistrict.provinceId = req.query.provinceId;
    if (req.query.districtId) whereDistrict.districtId = req.query.districtId;

    // Query with pagination
    const { rows, count } = await Staff.findAndCountAll({
      where: whereStaff,
      limit,
      offset: skip,
      order: [[orderBy, order]],
      include: [
        {
          model: District,
          as: "district",
          where: Object.keys(whereDistrict).length ? whereDistrict : undefined,
          required: !!Object.keys(whereDistrict).length,
          include: [
            {
              model: Province,
              as: "province",
              attributes: ["provinceName"],
            },
          ],
        },
        { model: Sale, as: "sales" },
      ],
    });

    res.status(200).json({
      data: rows,
      pagination: buildPaginationResponse(count, limit, page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching staffs",
      error: error instanceof Error ? error.message : error,
    });
  }
};



export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id, { include: ["district", "sales", "commissions"] });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff", error });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newStaff = await Staff.create(data);
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(500).json({ message: "Error creating staff", error });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    await staff.update(req.body);
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error updating staff", error });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await Staff.findByPk(id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    await staff.destroy();
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff", error });
  }
};
