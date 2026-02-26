import type { Request, Response, NextFunction } from "express";
import { LeavesService } from "./leaves.service.js";
import { getLeavesQuerySchema, getLeaveParamsSchema, updateLeaveStatusSchema } from "./leaves.dto.js";

export class LeavesController {
    static async listLeaves(req: Request, res: Response, next: NextFunction) {
        try {
            const params = getLeavesQuerySchema.parse(req.query);
            const { leaves, total } = await LeavesService.listLeaves(params);

            res.status(200).json({
                success: true,
                data: leaves,
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

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = getLeaveParamsSchema.parse(req.params);
            const { status } = updateLeaveStatusSchema.parse(req.body);

            const actorId = req.user!.id; // from requireAuth
            const leave = await LeavesService.updateStatus(id, status, actorId);
            res.status(200).json({ success: true, data: { leave } });
        } catch (e) {
            next(e);
        }
    }
}
