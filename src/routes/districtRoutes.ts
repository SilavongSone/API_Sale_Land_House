import express from "express";
import {
  getAllDistricts,
  getDistrictById,

  createDistrict,
  updateDistrict,
  deleteDistrict,
} from "../controllers/districtController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = express.Router();

router.get("/districts", authenticate, getAllDistricts);
router.get("/district/:id", authenticate, getDistrictById);
router.post("/district", authenticate, checkPermission("inserts"), createDistrict);
router.put("/district/:id", authenticate, checkPermission("updates"), updateDistrict);
router.delete("/district/:id", authenticate, checkPermission("deletes"), deleteDistrict);

export default router;
