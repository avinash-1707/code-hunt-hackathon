import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireRole } from "./hr-admin.middleware.js";

// Import sub-routers
import { dashboardRouter } from "./dashboard/dashboard.routes.js";
import { employeeRouter } from "./employee/employee.routes.js";
import { goalsRouter } from "./goals/goals.routes.js";
import { performanceRouter } from "./performance/performance.routes.js";
import { leavesRouter } from "./leaves/leaves.routes.js";
import { compensationRouter } from "./compensation/compensation.routes.js";
import { payrollRouter } from "./payroll/payroll.routes.js";
import { attendanceRouter } from "./attendance/attendance.routes.js";

const router = Router();

// Apply blanket security boundary
router.use(requireAuth);
router.use(requireRole("HR_ADMIN", "SUPER_ADMIN"));

// Mount sub-domains
router.use("/dashboard", dashboardRouter);
router.use("/employees", employeeRouter);
router.use("/goals", goalsRouter);
router.use("/reviews", performanceRouter);
router.use("/leaves", leavesRouter);
router.use("/compensation", compensationRouter);
router.use("/payroll", payrollRouter);
router.use("/attendance", attendanceRouter);

export default router;
