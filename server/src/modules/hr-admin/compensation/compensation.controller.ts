import type { Request, Response, NextFunction } from "express";
import { CompensationService } from "./compensation.service.js";
import {
    getCompQuerySchema,
    createCompSchema,
    employeeParamsSchema
} from "./compensation.dto.js";

export class CompensationController {
    static async listComp(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const params = getCompQuerySchema.parse(req.query);
            const { compensations, total } = await CompensationService.listComp(employeeId, params);

            res.status(200).json({
                success: true,
                data: compensations,
                meta: {
                    page: params.page,
                    pageSize: params.pageSize,
                    total,
                    totalPages: Math.ceil(total / params.pageSize),
                },
            });
        } catch (e) {
            next(e);
        }
    }

    static async createComp(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const data = createCompSchema.parse(req.body);
            const actorId = req.user!.id;
            const compensation = await CompensationService.createComp(employeeId, data, actorId);
            res.status(201).json({ success: true, data: { compensation } });
        } catch (e) {
            next(e);
        }
    }
}
