// controllers/provinceController.ts
import { Request, Response } from "express";
import Province from "../models/Province";

export const getAllProvinces = async (req: Request, res: Response) => {
  try {
    const provinces = await Province.findAll({ include: ["districts"] });
    res.status(200).json(provinces);
  } catch (error) {
    console.error(error); // ดู error จริงใน console
    res.status(500).json({
      message: "Error fetching provinces",
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const getProvinceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const province = await Province.findByPk(id, { include: ["districts"] });

    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    res.status(200).json(province);
  } catch (error) {
    res.status(500).json({ message: "Error fetching province", error });
  }
};

export const createProvince = async (req: Request, res: Response) => {
  try {
    const { provinceName } = req.body;
    const newProvince = await Province.create({ provinceName });
    res.status(201).json(newProvince);
  } catch (error) {
    res.status(500).json({ message: "Error creating province", error });
  }
};

export const updateProvince = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { provinceName } = req.body;

    const province = await Province.findByPk(id);
    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    await province.update({ provinceName });
    res.status(200).json(province);
  } catch (error) {
    res.status(500).json({ message: "Error updating province", error });
  }
};

export const deleteProvince = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const province = await Province.findByPk(id);

    if (!province) {
      return res.status(404).json({ message: "Province not found" });
    }

    await province.destroy();
    res.status(200).json({ message: "Province deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting province", error });
  }
};
