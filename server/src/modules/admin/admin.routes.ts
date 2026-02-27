import { Router } from "express";
import { AdminController } from "./admin.controller.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { requireSuperAdmin } from "../../middleware/roleAuth.js";
import { 
  createUserSchema, 
  updateUserSchema, 
  userQuerySchema 
} from "./admin.validators.js";
import { authRateLimiter } from "../../middleware/rate-limit.js";
import { requireCsrf } from "../../middleware/csrf.js";

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and Super Admin role
router.use(requireAuth);
router.use(requireSuperAdmin);

// User Management Routes
router.post(
  "/users",
  authRateLimiter,
  requireCsrf,
  validateBody(createUserSchema),
  adminController.createUser
);

router.get(
  "/users",
  validateQuery(userQuerySchema),
  adminController.getUsers
);

router.get(
  "/users/:id",
  adminController.getUserById
);

router.put(
  "/users/:id",
  requireCsrf,
  validateBody(updateUserSchema),
  adminController.updateUser
);

router.delete(
  "/users/:id",
  requireCsrf,
  adminController.deleteUser
);

// System Analytics Routes
router.get(
  "/stats",
  adminController.getSystemStats
);

export default router;
