import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/payments", authenticate, getAllPayments);
router.get("/payment/:id", authenticate, getPaymentById);
router.post("/payment", authenticate, checkPermission("inserts"), createPayment);
router.put("/payment/:id", authenticate, checkPermission("updates"), updatePayment);
router.delete("/payment/:id", authenticate, checkPermission("deletes"), deletePayment);

export default router;
