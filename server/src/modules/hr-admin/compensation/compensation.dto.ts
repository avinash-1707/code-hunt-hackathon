import { z } from "zod";

export const getCompQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
});

export const createCompSchema = z.object({
    baseSalary: z.number().positive(),
    bonus: z.number().nonnegative().optional(),
    currency: z.string().length(3).default("USD"),
    effectiveFrom: z.string().datetime(),
});

export const employeeParamsSchema = z.object({
    employeeId: z.string().cuid(),
});
