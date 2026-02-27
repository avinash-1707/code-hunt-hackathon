import { Router } from "express";
import { PayrollController } from "./payroll.controller.js";

export const payrollRouter = Router();

// Routes under /payroll
payrollRouter.patch("/:id/process", PayrollController.processPayroll);
// For the dashboard summary (or it could go to dashboard routes directly)
payrollRouter.get("/summary", PayrollController.getSummary);

// Used in employee.routes.ts under /employees/:employeeId/payroll
export const employeePayrollRouter = Router({ mergeParams: true });

employeePayrollRouter.get("/", PayrollController.listPayroll);
employeePayrollRouter.post("/", PayrollController.createDraft);
