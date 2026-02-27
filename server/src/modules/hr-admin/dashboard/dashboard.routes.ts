import { Router } from "express";
import { DashboardController } from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", DashboardController.getSummary);
