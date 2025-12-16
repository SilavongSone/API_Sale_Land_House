import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  register,
  updateUser,
  deleteUser,
  getUserOptions,
  login,
  getCurrentUser,
} from "../controllers/userController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.get("/users/options", authenticate, getUserOptions);
router.get("/users", authenticate, getAllUsers);

// User-specific routes (authorization handled in controller)
router.get("/user/:id", authenticate, getUserById);
router.put("/user/:id", authenticate, checkPermission("updates"), updateUser);
router.delete("/user/:id", authenticate, checkRole("ADMIN"), deleteUser);

export default router;