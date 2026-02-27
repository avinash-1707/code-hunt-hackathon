import { Router } from "express";
import { passport } from "../../config/passport.js";
import { env } from "../../config/env.js";
import { newId } from "../../utils/crypto.js";
import { setGoogleOAuthStateCookie } from "../../utils/cookies.js";

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
  authRateLimiter,
  (req, res, next) => {
    const state = newId();
    setGoogleOAuthStateCookie(res, state);

    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
      state,
    })(req, res, next);
  },
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/login?error=google_auth_failed`,
  }),
  asyncHandler(googleOAuthCallbackHandler),
);
router.post(
  "/refresh",
  authRateLimiter,
  requireCsrf,
  asyncHandler(refreshHandler),
);
router.post("/logout", requireCsrf, asyncHandler(logoutHandler));

export default router;
