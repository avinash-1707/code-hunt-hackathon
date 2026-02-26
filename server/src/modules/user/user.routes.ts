import { Router, type Request, type Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
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
        email: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    res.json({ user });
  }),
);

export default router;
