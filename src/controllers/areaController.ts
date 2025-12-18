import { Request, Response } from 'express';
import { AreaService } from '../services/AreaService';

export class AreaController {

    // GET /api/zones/:id/area -  Zone
    static async getZoneArea(req: Request, res: Response) {
        try {
            const area = await AreaService.calculateZoneArea(
                parseInt(req.params.id)
            );
            res.json({
                success: true,
                data: area
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/projects/:id/area -  Project
    static async getProjectArea(req: Request, res: Response) {
        try {
            const area = await AreaService.calculateProjectArea(
                parseInt(req.params.id)
            );
            res.json({
                success: true,
                data: area
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // GET /api/projects/:id/zones - Project with Zones
    static async getProjectWithZones(req: Request, res: Response) {
        try {
            const data = await AreaService.getProjectWithZones(
                parseInt(req.params.id)
            );
            res.json({
                success: true,
                data
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

// GET /api/projects/:id/summary
    static async getProjectSummary(req: Request, res: Response) {
        try {
            const data = await AreaService.getProjectSummary(
                parseInt(req.params.id)
            );
            res.json({
                success: true,
                data
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}