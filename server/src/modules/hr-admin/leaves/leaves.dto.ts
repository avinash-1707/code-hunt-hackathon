import { z } from "zod";

export const getLeavesQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
    employeeId: z.string().cuid().optional(),
});

export const updateLeaveStatusSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED"]),
});

export const getLeaveParamsSchema = z.object({
    id: z.string().cuid(),
});
