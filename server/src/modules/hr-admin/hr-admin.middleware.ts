import type { NextFunction, Request, Response } from "express";
import { prisma } from "../../prisma/client.js";
import { AppError } from "../../core/errors.js";



export const requireRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || !req.user.id) {
                next(new AppError(401, "Unauthorized"));
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { role: true },
            });

            if (!user) {
                next(new AppError(401, "Unauthorized"));
                return;
            }

            if (!roles.includes(user.role)) {
                next(new AppError(403, "Forbidden"));
                return;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
