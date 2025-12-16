import { Router } from "express";
import {
  getAllProvinces,
  getProvinceById,
  createProvince,
  updateProvince,
  deleteProvince,
} from "../controllers/provinceController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

// CRUD routes
router.get("/provinces", authenticate, getAllProvinces);           // GET all
router.get("/province/:id", authenticate, getProvinceById);       // GET by ID
router.post("/province", authenticate, checkPermission("inserts"), createProvince);          // CREATE
router.put("/province/:id", authenticate, checkPermission("updates"), updateProvince);        // UPDATE
router.delete("/province/:id", authenticate, checkPermission("deletes"), deleteProvince);     // DELETE

export default router;
