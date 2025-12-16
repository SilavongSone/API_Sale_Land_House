import { Router } from "express";
import {
  getAllZones,
  getOption,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
} from "../controllers/zoneController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/zones", authenticate, getAllZones);
router.get("/zones/options", authenticate, getOption);
router.get("/zone/:id", authenticate, getZoneById);
router.post("/zone", authenticate, checkPermission("inserts"), createZone);
router.put("/zone/:id", authenticate, checkPermission("updates"), updateZone);
router.delete("/zone/:id", authenticate, checkPermission("deletes"), deleteZone);

export default router;
