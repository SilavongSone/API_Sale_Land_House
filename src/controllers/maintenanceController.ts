// // controllers/maintenanceController.ts
// import { Request, Response } from "express";
// import Maintenance from "../models/Maintenance";

// export const getAllMaintenances = async (req: Request, res: Response) => {
//   try {
//     const maintenances = await Maintenance.findAll({
//       include: ["house", "customer"],
//     });
//     res.status(200).json(maintenances);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching maintenances", error });
//   }
// };

// export const getMaintenanceById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const maintenance = await Maintenance.findByPk(id, {
//       include: ["house", "customer"],
//     });

//     if (!maintenance) {
//       return res.status(404).json({ message: "Maintenance not found" });
//     }

//     res.status(200).json(maintenance);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching maintenance", error });
//   }
// };

// export const createMaintenance = async (req: Request, res: Response) => {
//   try {
//     const data = req.body;
//     const newMaintenance = await Maintenance.create(data);
//     res.status(201).json(newMaintenance);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating maintenance", error });
//   }
// };

// export const updateMaintenance = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const maintenance = await Maintenance.findByPk(id);

//     if (!maintenance) {
//       return res.status(404).json({ message: "Maintenance not found" });
//     }

//     await maintenance.update(req.body);
//     res.status(200).json(maintenance);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating maintenance", error });
//   }
// };

// export const deleteMaintenance = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const maintenance = await Maintenance.findByPk(id);

//     if (!maintenance) {
//       return res.status(404).json({ message: "Maintenance not found" });
//     }

//     await maintenance.destroy();
//     res.status(200).json({ message: "Maintenance deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting maintenance", error });
//   }
// };
