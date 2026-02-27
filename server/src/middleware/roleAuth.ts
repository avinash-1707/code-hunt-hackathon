import type { NextFunction, Request, Response } from "express";
import { AppError } from "../core/errors.js";
import { prisma } from "../prisma/client.js";

export const requireRole = (roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user?.id) {
      next(new AppError(401, "Unauthorized"));
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true, emailVerified: true }
      });

      if (!user) {
        next(new AppError(404, "User not found"));
        return;
      }

      if (!user.emailVerified) {
        next(new AppError(403, "Email not verified"));
        return;
      }

      if (!roles.includes(user.role)) {
        next(new AppError(403, "Insufficient permissions"));
        return;
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      next(new AppError(500, "Internal server error"));
    }
  };
};

export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireHRManager = requireRole(['SUPER_ADMIN', 'HR_MANAGER']);
export const requireHRAdmin = requireRole(['SUPER_ADMIN', 'HR_ADMIN', 'HR_MANAGER']);
