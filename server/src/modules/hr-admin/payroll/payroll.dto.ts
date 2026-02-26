import { z } from "zod";

export const getPayrollQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(25),
});

export const createPayrollSchema = z.object({
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000).max(2100),
    grossPay: z.number().positive(),
    basicSalary: z.number().positive(),
    allowances: z.number().nonnegative().default(0),
    deductionTax: z.number().nonnegative().default(0),
    deductionPF: z.number().nonnegative().default(0),
    deductionInsurance: z.number().nonnegative().default(0),
    deductionOther: z.number().nonnegative().default(0),
    totalDeductions: z.number().nonnegative(),
    netPay: z.number().nonnegative(),
    currency: z.string().length(3).default("USD"),
});

export const employeeParamsSchema = z.object({
    employeeId: z.string().cuid(),
});

export const payrollParamsSchema = z.object({
    id: z.string().cuid(),
});
