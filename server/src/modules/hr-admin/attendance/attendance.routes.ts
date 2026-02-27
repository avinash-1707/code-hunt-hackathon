import { Router } from "express";
import { AttendanceController } from "./attendance.controller.js";

// Top level attendance routes if any
export const attendanceRouter = Router();

// Employee specific attendance routes mounted under /employees/:employeeId/attendance
export const employeeAttendanceRouter = Router({ mergeParams: true });

employeeAttendanceRouter.get("/", AttendanceController.listAttendance);
employeeAttendanceRouter.post("/", AttendanceController.upsertAttendance);
employeeAttendanceRouter.get("/summary", AttendanceController.getSummary);
