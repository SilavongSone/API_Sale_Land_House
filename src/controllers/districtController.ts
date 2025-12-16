// controllers/districtController.ts
import { Request, Response } from "express";
import District from "../models/District";

export const getAllDistricts = async (req: Request, res: Response) => {
  try {
    const districts = await District.findAll({
      include: ["province", "projects", "customers", "staffs"],
    });
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching districts", error });
  }
};

export const getDistrictById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const district = await District.findByPk(id, {
      include: ["province", "projects", "customers", "staffs"],
    });

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    res.status(200).json(district);
  } catch (error) {
    res.status(500).json({ message: "Error fetching district", error });
  }
};

export const createDistrict = async (req: Request, res: Response) => {
  try {
    const { provinceId, districtName } = req.body;
    const newDistrict = await District.create({ provinceId, districtName });
    res.status(201).json(newDistrict);
  } catch (error) {
    res.status(500).json({ message: "Error creating district", error });
  }
};

export const updateDistrict = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { provinceId, districtName } = req.body;

    const district = await District.findByPk(id);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    await district.update({ provinceId, districtName });
    res.status(200).json(district);
  } catch (error) {
    res.status(500).json({ message: "Error updating district", error });
  }
};

export const deleteDistrict = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const district = await District.findByPk(id);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    await district.destroy();
    res.status(200).json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting district", error });
  }
};
