import type { Request, Response, NextFunction } from "express";
import { GoalsService } from "./goals.service.js";
import {
    getGoalsQuerySchema,
    createGoalSchema,
    updateGoalSchema,
    goalParamsSchema,
    employeeParamsSchema
} from "./goals.dto.js";

export class GoalsController {
    static async listGoals(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const params = getGoalsQuerySchema.parse(req.query);
            const { goals, total } = await GoalsService.listGoals(employeeId, params);

            res.status(200).json({
                success: true,
                data: goals,
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

    static async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const summary = await GoalsService.getSummary(employeeId);
            res.status(200).json({ success: true, data: summary });
        } catch (e) {
            next(e);
        }
    }

    static async createGoal(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const data = createGoalSchema.parse(req.body);
            const actorId = req.user!.id;
            const goal = await GoalsService.createGoal(employeeId, data, actorId);
            res.status(201).json({ success: true, data: { goal } });
        } catch (e) {
            next(e);
        }
    }

    static async updateGoal(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = goalParamsSchema.parse(req.params);
            const data = updateGoalSchema.parse(req.body);
            const actorId = req.user!.id;
            const goal = await GoalsService.updateGoal(id, data, actorId);
            res.status(200).json({ success: true, data: { goal } });
        } catch (e) {
            next(e);
        }
    }
}
