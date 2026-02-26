import { Router } from "express";
import { GoalsController } from "./goals.controller.js";

export const goalsRouter = Router();

// Routes under /goals
goalsRouter.patch("/:id", GoalsController.updateGoal);

// Employee specific routes should be handled here differently if we mount them from employee.routes.ts
// We'll export another router for employee-goals
export const employeeGoalsRouter = Router({ mergeParams: true });

employeeGoalsRouter.get("/", GoalsController.listGoals);
employeeGoalsRouter.post("/", GoalsController.createGoal);
employeeGoalsRouter.get("/summary", GoalsController.getSummary);
