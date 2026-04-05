import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token required"),
});
