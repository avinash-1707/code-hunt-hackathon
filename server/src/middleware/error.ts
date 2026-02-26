import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors.js";

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
