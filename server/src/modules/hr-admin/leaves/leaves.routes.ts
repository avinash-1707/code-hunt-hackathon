import { Router } from "express";
import { LeavesController } from "./leaves.controller.js";

export const leavesRouter = Router();

leavesRouter.get("/", LeavesController.listLeaves);
leavesRouter.patch("/:id/status", LeavesController.updateStatus);
