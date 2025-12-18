import { Router } from 'express';
import { AreaController } from '../controllers/areaController';

const router = Router();

// Zone level
router.get('/zones/:id/area', AreaController.getZoneArea);

// Project level
router.get('/projects/:id/area', AreaController.getProjectArea);
router.get('/projects/:id/zones', AreaController.getProjectWithZones);
router.get('/projects/:id/summary', AreaController.getProjectSummary);

export default router;