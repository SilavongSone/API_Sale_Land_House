import { Router } from "express";
import {
  getAllLandPlots,
  getLandPlotById,
  createLandPlot,
  updateLandPlot,
  deleteLandPlot,
} from "../controllers/landPlotController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/landplots", authenticate, getAllLandPlots);
router.get("/landplot/:id", authenticate, getLandPlotById);
router.post("/landplot", authenticate, checkPermission("inserts"), createLandPlot);
router.put("/landplot/:id", authenticate, checkPermission("updates"), updateLandPlot);
router.delete("/landplot/:id", authenticate, checkPermission("deletes"), deleteLandPlot);

export default router;
