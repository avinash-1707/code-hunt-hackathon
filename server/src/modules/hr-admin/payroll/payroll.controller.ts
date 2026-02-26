import type { Request, Response, NextFunction } from "express";
import { PayrollService } from "./payroll.service.js";
import {
    getPayrollQuerySchema,
    createPayrollSchema,
    employeeParamsSchema,
    payrollParamsSchema
} from "./payroll.dto.js";

export class PayrollController {
    static async listPayroll(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const params = getPayrollQuerySchema.parse(req.query);
            const { payrolls, total } = await PayrollService.listPayroll(employeeId, params);

            res.status(200).json({
                success: true,
                data: payrolls,
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

    static async createDraft(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const data = createPayrollSchema.parse(req.body);

            const payroll = await PayrollService.createDraft(employeeId, data);
            res.status(201).json({ success: true, data: { payroll } });
        } catch (e) {
            next(e);
        }
    }

    static async processPayroll(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = payrollParamsSchema.parse(req.params);
            const actorId = req.user!.id;
            const payroll = await PayrollService.processPayroll(id, actorId);
            res.status(200).json({ success: true, data: { payroll } });
        } catch (e) {
            next(e);
        }
    }

    static async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const summary = await PayrollService.getSummary();
            res.status(200).json({ success: true, data: summary });
        } catch (e) {
            next(e);
        }
    }
}
