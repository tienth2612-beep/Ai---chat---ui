import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email").email("Please enter a valid email address"),
  password: z.string().min(6, "Please enter your password"),
});

export type TLogin = z.infer<typeof loginSchema>;