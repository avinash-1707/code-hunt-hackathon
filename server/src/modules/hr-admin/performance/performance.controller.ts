import type { Request, Response, NextFunction } from "express";
import { PerformanceService } from "./performance.service.js";
import {
    getReviewsQuerySchema,
    createReviewSchema,
    employeeParamsSchema
} from "./performance.dto.js";

export class PerformanceController {
    static async listReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const params = getReviewsQuerySchema.parse(req.query);
            const { reviews, total } = await PerformanceService.listReviews(employeeId, params);

            res.status(200).json({
                success: true,
                data: reviews,
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

    static async createReview(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const data = createReviewSchema.parse(req.body);
            const actorId = req.user!.id;
            const review = await PerformanceService.createReview(employeeId, data, actorId);
            res.status(201).json({ success: true, data: { review } });
        } catch (e) {
            next(e);
        }
    }
}
