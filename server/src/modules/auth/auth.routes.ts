import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { asyncHandler } from "../../core/async-handler.js";
import { validateBody } from "../../middleware/validate.js";
import { googleSchema, loginSchema, registerSchema } from "./auth.validators.js";
import { authRateLimiter } from "../../middleware/rate-limit.js";
import { requireCsrf } from "../../middleware/csrf.js";

const router = Router();
const controller = new AuthController();

router.post("/register", authRateLimiter, validateBody(registerSchema), asyncHandler(controller.register.bind(controller)));
router.post("/login", authRateLimiter, validateBody(loginSchema), asyncHandler(controller.login.bind(controller)));
router.post("/google", authRateLimiter, validateBody(googleSchema), asyncHandler(controller.google.bind(controller)));
router.post("/refresh", authRateLimiter, requireCsrf, asyncHandler(controller.refresh.bind(controller)));
router.post("/logout", requireCsrf, asyncHandler(controller.logout.bind(controller)));

export default router;
