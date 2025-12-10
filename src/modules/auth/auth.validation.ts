import z from 'zod';

// Register schema
export const registerSchema = z.object({
    fullname: z
        .string()
        .min(3, { message: "Fullname must be at least 3 characters" }),
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email format" }),
    nim: z
        .string()
        .min(6, { message: "Student ID must be at least 6 characters" })
        .max(20, { message: "Student ID must not exceed 20 characters" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
    role: z
        .enum(["voter", "staff"])
        .optional()
        .default("voter")
})

// Login schema
export const loginSchema = z.object({
    nim: z
        .string()
        .min(1, { message: "Student ID is required" })
        .max(20, { message: "Student ID must not exceed 20 characters" }),
    password: z
        .string()
        .min(1, { message: "Password is required" })
})