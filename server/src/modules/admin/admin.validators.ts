import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"], {
    errorMap: () => ({ message: "Invalid role. Must be SUPER_ADMIN, HR_ADMIN, or HR_MANAGER" })
  }),
  departmentId: z.string().optional()
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"]).optional(),
  departmentId: z.string().optional(),
  emailVerified: z.boolean().optional()
});

export const updateRoleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"], {
    errorMap: () => ({ message: "Invalid role. Must be SUPER_ADMIN, HR_ADMIN, or HR_MANAGER" })
  }),
  departmentId: z.string().optional()
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name too long"),
  description: z.string().optional()
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required").max(100, "Department name too long").optional(),
  description: z.string().optional(),
  active: z.boolean().optional()
});

export const userQuerySchema = z.object({
  page: z.string().transform(Number).refine(n => n > 0, "Page must be positive").optional(),
  limit: z.string().transform(Number).refine(n => n > 0 && n <= 100, "Limit must be between 1 and 100").optional(),
  role: z.enum(["SUPER_ADMIN", "HR_ADMIN", "HR_MANAGER"]).optional(),
  departmentId: z.string().optional(),
  search: z.string().optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
