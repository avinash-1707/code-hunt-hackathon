import { z } from "zod";

const strongPassword = z
  .string()
  .min(12)
  .max(128)
  .regex(/[A-Z]/, "Must include uppercase letter")
  .regex(/[a-z]/, "Must include lowercase letter")
  .regex(/[0-9]/, "Must include number")
  .regex(/[^A-Za-z0-9]/, "Must include special character");

export const registerSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1),
});

export const googleSchema = z.object({
  idToken: z.string().min(20),
});
