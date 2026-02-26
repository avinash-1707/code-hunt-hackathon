import { z } from "zod";

export const getGoalsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
    type: z.enum(["WEEKLY", "MONTHLY"]).optional(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const createGoalSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(2000).optional(),
    type: z.enum(["WEEKLY", "MONTHLY"]),
    dueDate: z.string().datetime(),
    status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("NOT_STARTED"),
});

export const updateGoalSchema = createGoalSchema.partial();

export const goalParamsSchema = z.object({
    id: z.string().cuid(),
});

export const employeeParamsSchema = z.object({
    employeeId: z.string().cuid(),
});
