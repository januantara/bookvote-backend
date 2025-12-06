import z from 'zod';

// Register schema
export const registerSchema = z.object({
    fullname: z
        .string()
        .min(3, { message: "Mohon isikan nama lengkap terlebih dahulu" }),
    email: z
        .string()
        .min(1, { message: "Mohon isikan email terlebih dahulu" })
        .email(),
    nim: z
        .string()
        .min(6, { message: "Mohon isikan nim terlebih dahulu" })
        .max(20, { message: "Mohon isikan nim dengan benar!" }),
    password: z
        .string()
        .min(1, { message: "Mohon masukan password terlebih dahulu!" })
        .min(8, { message: "Password minimal terdiri dari 8 karakter" }),
    role: z
        .enum(["voter", "staff"])
        .optional()
        .default("voter")
})

// Login schema
export const loginSchema = z.object({
    nim: z
        .string()
        .min(1, { message: "Isikan nim terlebih dahulu" })
        .max(20, { message: "Masukan nim dengan benar" }),
    password: z
        .string()
        .min(1, { message: "Masukan password terlebih dahulu" })
})