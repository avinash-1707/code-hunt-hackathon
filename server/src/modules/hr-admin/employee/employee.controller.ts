import type { Request, Response, NextFunction } from "express";
import { EmployeeService } from "./employee.service.js";
import { getEmployeesQuerySchema, getEmployeeParamsSchema, updateEmployeeStatusSchema } from "./employee.dto.js";

export class EmployeeController {
    static async listEmployees(req: Request, res: Response, next: NextFunction) {
        try {
            const params = getEmployeesQuerySchema.parse(req.query);
            const { employees, total } = await EmployeeService.listEmployees(params);

            res.status(200).json({
                success: true,
                data: employees,
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

    static async getEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = getEmployeeParamsSchema.parse(req.params);
            const employee = await EmployeeService.getEmployee(id);
            res.status(200).json({ success: true, data: { employee } });
        } catch (e) {
            next(e);
        }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = getEmployeeParamsSchema.parse(req.params);
            const { status } = updateEmployeeStatusSchema.parse(req.body);

            const actorId = req.user!.id; // from requireAuth
            const employee = await EmployeeService.updateStatus(id, status, actorId);
            res.status(200).json({ success: true, data: { employee } });
        } catch (e) {
            next(e);
        }
    }

    static async softDelete(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = getEmployeeParamsSchema.parse(req.params);
            const actorId = req.user!.id;
            await EmployeeService.softDelete(id, actorId);
            res.status(200).json({ success: true });
        } catch (e) {
            next(e);
        }
    }
}
