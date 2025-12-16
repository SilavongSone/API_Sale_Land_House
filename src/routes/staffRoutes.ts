// src/routes/staffRoutes.ts
import { Router } from "express";
import { createStaff, getAllStaffs, getStaffById, updateStaff, deleteStaff } from "../controllers/staffController";
import {
    authenticate,
    checkPermission,
    checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/staffs", authenticate, getAllStaffs);
router.get("/staffs/:id", authenticate, getStaffById);
router.post("/staff", authenticate, createStaff);
router.put("/staff/:id", authenticate, updateStaff);
router.delete("/staff/:id", authenticate, deleteStaff);

export default router;
