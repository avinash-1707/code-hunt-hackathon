import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new AppError(401, "Unauthorized"));
    return;
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    next(new AppError(401, "Unauthorized"));
  }
};
