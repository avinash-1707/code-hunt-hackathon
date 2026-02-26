import type { Request, Response, NextFunction } from "express";
import { AttendanceService } from "./attendance.service.js";
import {
    getAttendanceQuerySchema,
    upsertAttendanceSchema,
    employeeParamsSchema
} from "./attendance.dto.js";

export class AttendanceController {
    static async listAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const params = getAttendanceQuerySchema.parse(req.query);
            const { records } = await AttendanceService.listAttendance(employeeId, params);

            res.status(200).json({
                success: true,
                data: records,
            });
        } catch (e) {
            next(e);
        }
    }

    static async upsertAttendance(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const data = upsertAttendanceSchema.parse(req.body);

            const actorId = req.user!.id; // from requireAuth
            const record = await AttendanceService.upsertAttendance(employeeId, data, actorId);
            res.status(200).json({ success: true, data: { record } });
        } catch (e) {
            next(e);
        }
    }

    static async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const { employeeId } = employeeParamsSchema.parse(req.params);
            const { month, year } = getAttendanceQuerySchema.parse(req.query);

            if (!month || !year) {
                return res.status(400).json({ success: false, message: "month and year are required" });
            }

            const summary = await AttendanceService.getSummary(employeeId, month, year);
            res.status(200).json({ success: true, data: summary });
        } catch (e) {
            next(e);
        }
    }
}
