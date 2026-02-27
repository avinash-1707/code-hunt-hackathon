import { Router } from "express";
import { CompensationController } from "./compensation.controller.js";

export const compensationRouter = Router();

// Used in employee.routes.ts under /employees/:employeeId/compensation
export const employeeCompensationRouter = Router({ mergeParams: true });

employeeCompensationRouter.get("/", CompensationController.listComp);
employeeCompensationRouter.post("/", CompensationController.createComp);
