import { Router } from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/customers", authenticate, getAllCustomers);
router.get("/customer/:id", authenticate, getCustomerById);
router.post("/customer", authenticate, checkPermission("inserts"), createCustomer);
router.put("/customer/:id", authenticate, checkPermission("updates"), updateCustomer);
router.delete("/customer/:id", authenticate, checkPermission("deletes"), deleteCustomer);

export default router;
