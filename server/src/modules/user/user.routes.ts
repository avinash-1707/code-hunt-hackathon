import { Router, type Request, type Response } from "express";
import { requireAuth, requireRoles } from "../../middleware/auth.js";
import { asyncHandler } from "../../core/async-handler.js";
import { prisma } from "../../prisma/client.js";

const router = Router();

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const normalizedUser = user
      ? {
          ...user,
          name: user.name ?? req.user?.name ?? user.email.split("@")[0] ?? "User",
        }
      : null;

    res.json({ user: normalizedUser });
  }),
);

router.get(
  "/admin-check",
  requireAuth,
  requireRoles("SUPER_ADMIN", "HR_ADMIN"),
  asyncHandler(async (_req: Request, res: Response) => {
    res.json({ ok: true, message: "Role check passed" });
  }),
);

export default router;
