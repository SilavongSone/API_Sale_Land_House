import { Router } from "express";
import {
  getAllHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
} from "../controllers/houseController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/houses", authenticate, getAllHouses);
router.get("/house/:id", authenticate, getHouseById);
router.post("/house", authenticate, checkPermission("inserts"), createHouse);
router.put("/house/:id", authenticate, checkPermission("updates"), updateHouse);
router.delete("/house/:id", authenticate, checkPermission("deletes"), deleteHouse);

export default router;
