import { Router } from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

router.get("/expenses", authenticate, getAllExpenses);
router.get("/expense/:id", authenticate, getExpenseById);
router.post("/expense", authenticate, checkPermission("inserts"), createExpense);
router.put("/expense/:id", authenticate, checkPermission("updates"), updateExpense);
router.delete("/expense/:id", authenticate, checkPermission("deletes"), deleteExpense);

export default router;
