import { Router } from "express";
import {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getOption,
} from "../controllers/saleController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

// Get sales options (for dropdowns/select lists)
router.get("/sales/options", authenticate, getOption);

// Get all sales with pagination and filters
router.get("/sales", authenticate, getAllSales);

// Get single sale by ID
router.get("/sales/:id", authenticate, getSaleById);

// Create new sale
router.post("/sales", authenticate, checkPermission("inserts"), createSale);

// Update existing sale
router.put("/sales/:id", authenticate, checkPermission("updates"), updateSale);

// Delete sale
router.delete("/sales/:id", authenticate, checkPermission("deletes"), deleteSale);

export default router;