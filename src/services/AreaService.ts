import Project from '../models/Project';
import Zone from '../models/Zone';
import House from '../models/House';
import LandPlot from '../models/LandPlot';

export class AreaService {

    // ========== ZONE LEVEL ==========

    // calculate area of single Zone
    static async calculateZoneArea(zoneId: number) {
        const zone = await Zone.findByPk(zoneId);
        if (!zone) {
            throw new Error('Zone not found');
        }

        const [houseArea, landPlotArea] = await Promise.all([
            House.sum('landArea', { where: { zoneId } }) || 0,
            LandPlot.sum('landArea', { where: { zoneId } }) || 0
        ]);

        const usedArea = Number(houseArea) + Number(landPlotArea);
        const remainingArea = zone.totalLandArea - usedArea;

        return {
            zoneId: zone.zoneId,
            zoneName: zone.zoneName,
            totalArea: zone.totalLandArea,
            usedArea,
            remainingArea,
            usedPercentage: (usedArea / zone.totalLandArea) * 100
        };
    }

    // ========== PROJECT LEVEL ==========

    // calculate area of Project
    static async calculateProjectArea(projectId: number) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // all Zone in Project
        const totalZoneArea = await Zone.sum('totalLandArea', {
            where: { projectId }
        }) || 0;

        const usedArea = Number(totalZoneArea);
        const remainingArea = project.totalLandArea - usedArea;

        return {
            projectId: project.projectId,
            projectName: project.projectName,
            totalArea: project.totalLandArea,
            usedArea,
            remainingArea,
            usedPercentage: (usedArea / project.totalLandArea) * 100
        };
    }

    // ========== PROJECT WITH ZONES ==========


    static async getProjectWithZones(projectId: number) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // all zones in project
        const zones = await Zone.findAll({
            where: { projectId },
            order: [['zoneName', 'ASC']]
        });


        const zonesWithAreas = await Promise.all(
            zones.map(async (zone) => {
                const [houseArea, landPlotArea] = await Promise.all([
                    House.sum('landArea', { where: { zoneId: zone.zoneId } }) || 0,
                    LandPlot.sum('landArea', { where: { zoneId: zone.zoneId } }) || 0
                ]);

                const usedArea = Number(houseArea) + Number(landPlotArea);
                const remainingArea = zone.totalLandArea - usedArea;

                return {
                    zoneId: zone.zoneId,
                    zoneName: zone.zoneName,
                    zoneCode: zone.zoneCode,
                    totalArea: zone.totalLandArea,
                    usedArea,
                    remainingArea,
                    usedPercentage: (usedArea / zone.totalLandArea) * 100,
                    status: zone.status
                };
            })
        );

        // calculate remaining area of project
        const totalZoneArea = zones.reduce((sum, z) => sum + z.totalLandArea, 0);
        const projectRemainingArea = project.totalLandArea - totalZoneArea;

        return {
            projectId: project.projectId,
            projectName: project.projectName,
            village: project.village,
            totalArea: project.totalLandArea,
            allocatedToZones: totalZoneArea,
            remainingArea: projectRemainingArea,
            usedPercentage: (totalZoneArea / project.totalLandArea) * 100,
            zones: zonesWithAreas,
            zoneCount: zones.length
        };
    }

    // ========== SUMMARY ==========

    //  level (Project > Zone > House/LandPlot)
    static async getProjectSummary(projectId: number) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        const zones = await Zone.findAll({
            where: { projectId }
        });


        const zoneDetails = await Promise.all(
            zones.map(async (zone) => {
                const [houses, landPlots, houseArea, landPlotArea] = await Promise.all([
                    House.count({ where: { zoneId: zone.zoneId } }),
                    LandPlot.count({ where: { zoneId: zone.zoneId } }),
                    House.sum('landArea', { where: { zoneId: zone.zoneId } }) || 0,
                    LandPlot.sum('landArea', { where: { zoneId: zone.zoneId } }) || 0
                ]);

                const usedArea = Number(houseArea) + Number(landPlotArea);
                const remainingArea = zone.totalLandArea - usedArea;

                return {
                    zoneId: zone.zoneId,
                    zoneName: zone.zoneName,
                    totalArea: zone.totalLandArea,
                    usedArea,
                    remainingArea,
                    houseCount: houses,
                    landPlotCount: landPlots,
                    houseArea: Number(houseArea),
                    landPlotArea: Number(landPlotArea)
                };
            })
        );


        const totalZoneArea = zones.reduce((sum, z) => sum + z.totalLandArea, 0);
        const totalHouseArea = zoneDetails.reduce((sum, z) => sum + z.houseArea, 0);
        const totalLandPlotArea = zoneDetails.reduce((sum, z) => sum + z.landPlotArea, 0);
        const totalUsedInZones = totalHouseArea + totalLandPlotArea;

        return {
            project: {
                projectId: project.projectId,
                projectName: project.projectName,
                totalArea: project.totalLandArea,
                allocatedToZones: totalZoneArea,
                remainingArea: project.totalLandArea - totalZoneArea,
                usedPercentage: (totalZoneArea / project.totalLandArea) * 100
            },
            summary: {
                totalZones: zones.length,
                totalHouses: zoneDetails.reduce((sum, z) => sum + z.houseCount, 0),
                totalLandPlots: zoneDetails.reduce((sum, z) => sum + z.landPlotCount, 0),
                totalHouseArea,
                totalLandPlotArea,
                totalUsedInZones,
                totalRemainingInZones: totalZoneArea - totalUsedInZones
            },
            zones: zoneDetails
        };
    }
}