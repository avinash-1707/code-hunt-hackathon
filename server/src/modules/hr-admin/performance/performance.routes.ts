import { Router } from "express";
import { PerformanceController } from "./performance.controller.js";

export const performanceRouter = Router();

// Used in employee.routes.ts under /employees/:employeeId/reviews
export const employeePerformanceRouter = Router({ mergeParams: true });

employeePerformanceRouter.get("/", PerformanceController.listReviews);
employeePerformanceRouter.post("/", PerformanceController.createReview);
