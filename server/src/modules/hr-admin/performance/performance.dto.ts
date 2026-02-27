import { z } from "zod";

export const getReviewsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
});

export const createReviewSchema = z.object({
    reviewPeriod: z.string().min(2).max(50),
    rating: z.number().int().min(1).max(5),
    comments: z.string().max(2000).optional(),
});

export const employeeParamsSchema = z.object({
    employeeId: z.string().cuid(),
});
