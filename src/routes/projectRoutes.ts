import { Router } from "express";
import {
  getAllProjects,
  getOption,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import {
  authenticate,
  checkPermission,
  checkRole,
} from "../middleware/authMiddleware";

const router = Router();

// -------------------
// Public endpoint
// -------------------
router.get("/projects/options", getOption);

// -------------------
// Protected endpoints
// -------------------
router.get(
  "/projects",
  authenticate,               
  // checkPermission("inserts"), 
  getAllProjects
);

router.get(
  "/projects/:id",
  authenticate,
  // checkPermission("inserts"),
  getProjectById
);

router.post(
  "/projects",
  authenticate,
  checkPermission("inserts"),
  createProject
);

router.put(
  "/projects/:id",
  authenticate,
  checkPermission("updates"),
  updateProject
);

router.delete(
  "/projects/:id",
  authenticate,
  checkPermission("deletes"),
  deleteProject
);

export default router;
