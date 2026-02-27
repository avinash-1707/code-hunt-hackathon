import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors.js";

export const notFound = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();
  const requestMeta = `${req.method} ${req.originalUrl}`;

  if (err instanceof AppError) {
    console.error(
      `[${timestamp}] ${requestMeta} -> ${err.statusCode} ${err.message}`,
    );
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  const stack = err instanceof Error ? err.stack : undefined;

  console.error(`[${timestamp}] ${requestMeta} -> 500 ${message}`);
  if (stack) {
    console.error(stack);
  } else {
    console.error(err);
  }

  res.status(500).json({ message: "Internal server error" });
};
