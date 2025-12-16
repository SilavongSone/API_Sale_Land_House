import { Router } from "express";
import {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../controllers/currencyController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/currencies", authenticate, getAllCurrencies);
router.get("/currency/:id", authenticate, getCurrencyById);
router.post("/currency", authenticate, checkPermission("inserts"), createCurrency);
router.put("/currency/:id", authenticate, checkPermission("updates"), updateCurrency);
router.delete("/currency/:id", authenticate, checkPermission("deletes"), deleteCurrency);

export default router;
