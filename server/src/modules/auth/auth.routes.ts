import { Router } from "express";

import { asyncHandler } from "../../core/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import { authRateLimiter } from "../../middleware/rate-limit.js";
import { requireCsrf } from "../../middleware/csrf.js";
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "./auth.controller.js";
import { loginSchema, registerSchema } from "./auth.validators.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateBody(registerSchema),
  asyncHandler(registerHandler),
);
router.post(
  "/login",
  authRateLimiter,
  validateBody(loginSchema),
  asyncHandler(loginHandler),
);
router.post(
  "/refresh",
  authRateLimiter,
  requireCsrf,
  asyncHandler(refreshHandler),
);
router.post("/logout", requireCsrf, asyncHandler(logoutHandler));

export default router;
