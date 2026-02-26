import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../core/errors.js";

export const validateBody =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      next(new AppError(400, parsed.error.flatten().formErrors.join(", ") || "Invalid request body"));
      return;
    }

    req.body = parsed.data;
    next();
  };
