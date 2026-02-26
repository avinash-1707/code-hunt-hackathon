import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors.js";
import { CSRF_COOKIE_NAME } from "../config/constants.js";
import { corsOrigins } from "../config/env.js";

export const requireCsrf = (req: Request, _res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;

  if (origin && !corsOrigins.includes(origin)) {
    next(new AppError(403, "Forbidden origin"));
    return;
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || typeof headerToken !== "string" || headerToken !== cookieToken) {
    next(new AppError(403, "CSRF validation failed"));
    return;
  }

  next();
};
