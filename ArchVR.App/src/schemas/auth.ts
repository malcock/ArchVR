import { z } from "zod";
import { emailField } from "./core";

export const passwordSchema = z
  .string()
  .min(10, { message: "Password must be at least 10 characters long" })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least 1 number",
  })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least 1 uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least 1 lowercase letter",
  })
  .refine((password) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password), {
    message: "Password must contain at least 1 special character",
  });

export const registerSchema = z.object({
  email: emailField,
  password: passwordSchema,
});

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
  });
