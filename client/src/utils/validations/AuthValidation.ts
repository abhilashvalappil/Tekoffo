import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3, "username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").regex(/\d/, "Password must contain a number"),
    confirmPassword: z.string(),
    role: z.enum(['client', 'freelancer']).optional()
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  export const signinSchema = z.object({
    identifier: z.string().min(3, "Enter a valid username or email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  export const ResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters").regex(/\d/, "Password must contain a number"),
    confirmPassword: z.string(),
  });

  export type SignUpFormData = z.infer<typeof signupSchema>;
  export type SignInFormData = z.infer<typeof signinSchema>;
  export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;