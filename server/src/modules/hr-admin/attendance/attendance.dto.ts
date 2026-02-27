import { z } from "zod";

export const getAttendanceQuerySchema = z.object({
    month: z.coerce.number().int().min(1).max(12).optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const upsertAttendanceSchema = z.object({
    date: z.string().datetime(),
    status: z.enum(["PRESENT", "ABSENT", "LEAVE", "HALF_DAY"]),
    checkIn: z.string().datetime().optional(),
    checkOut: z.string().datetime().optional(),
    notes: z.string().max(1000).optional(),
});

export const employeeParamsSchema = z.object({
    employeeId: z.string().cuid(),
});
