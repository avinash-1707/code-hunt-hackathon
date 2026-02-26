import { Router } from "express";
import { passport } from "../../config/passport.js";

import { asyncHandler } from "../../core/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import { authRateLimiter } from "../../middleware/rate-limit.js";
import { requireCsrf } from "../../middleware/csrf.js";
import {
  googleOAuthCallbackHandler,
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
router.get(
  "/google/oauth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/google/failure",
  }),
  asyncHandler(googleOAuthCallbackHandler),
);
router.get("/google/failure", (_req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});
router.post(
  "/refresh",
  authRateLimiter,
  requireCsrf,
  asyncHandler(refreshHandler),
);
router.post("/logout", requireCsrf, asyncHandler(logoutHandler));

export default router;
