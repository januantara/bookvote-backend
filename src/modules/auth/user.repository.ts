import { db } from "../../config/db";
import { users } from "../../db/schema";
import { eq, or } from "drizzle-orm";

export interface CreateUserProps {
    fullname: string;
    email: string;
    passwordHash: string;
    nim: string;
    role?: "staff" | "voter";
}

export const userRepository = {
    findByNim: (nim: string) =>
        db.query.users.findFirst({ where: (u) => eq(u.nim, nim) }),

    findByEmailOrNim: (email: string, nim: string) =>
        db.query.users.findFirst({
            where: (u) => or(eq(u.email, email), eq(u.nim, nim)),
        }),

    findById: (id: string) =>
        db.query.users.findFirst({ where: (u) => eq(u.id, id) }),

    create: (data: CreateUserProps) =>
        db.insert(users).values(data).returning({
            id: users.id,
            fullname: users.fullname,
            email: users.email,
            nim: users.nim,
            role: users.role,
        }),
};
