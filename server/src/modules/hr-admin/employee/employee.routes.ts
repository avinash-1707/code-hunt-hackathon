import { Router } from "express";
import { EmployeeController } from "./employee.controller.js";
import { employeeGoalsRouter } from "../goals/goals.routes.js";
import { employeePerformanceRouter } from "../performance/performance.routes.js";
import { employeeCompensationRouter } from "../compensation/compensation.routes.js";
import { employeePayrollRouter } from "../payroll/payroll.routes.js";
import { employeeAttendanceRouter } from "../attendance/attendance.routes.js";

export const employeeRouter = Router();

employeeRouter.use("/:employeeId/goals", employeeGoalsRouter);
employeeRouter.use("/:employeeId/reviews", employeePerformanceRouter);
employeeRouter.use("/:employeeId/compensation", employeeCompensationRouter);
employeeRouter.use("/:employeeId/payroll", employeePayrollRouter);
employeeRouter.use("/:employeeId/attendance", employeeAttendanceRouter);

employeeRouter.get("/", EmployeeController.listEmployees);
employeeRouter.get("/:id", EmployeeController.getEmployee);
employeeRouter.patch("/:id/status", EmployeeController.updateStatus);
employeeRouter.delete("/:id/soft-delete", EmployeeController.softDelete);
