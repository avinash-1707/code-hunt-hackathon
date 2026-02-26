import { z } from "zod";

export const getEmployeesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
    search: z.string().optional(),
    departmentId: z.string().optional(),
    status: z.enum(["ACTIVE", "RESIGNED", "TERMINATED"]).optional(),
    employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]).optional(),
    includeDeleted: z.coerce.boolean().default(false),
    sortBy: z.enum(["firstName", "joiningDate", "department"]).default("firstName"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const getEmployeeParamsSchema = z.object({
    id: z.string().cuid(),
});

export const updateEmployeeStatusSchema = z.object({
    status: z.enum(["ACTIVE", "RESIGNED", "TERMINATED"]),
});
