import { z } from "zod";

const strongPassword = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character");

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email").transform((value) => value.toLowerCase().trim()),
  password: strongPassword,
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email").transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(20, "Google ID token is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type GoogleAuthFormValues = z.infer<typeof googleAuthSchema>;
