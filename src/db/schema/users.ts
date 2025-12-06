import { relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core"
import { refreshTokens } from "./auth";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// User Role Enum
export const userRole = pgEnum("user_role", [
    "staff",
    "voter"
])

// Users Table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    fullname: text("fullname").notNull(),
    email: varchar("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    nim: varchar("nim").notNull().unique(),
    role: userRole("role").default("voter").notNull(),
    createdAt: timestamp("created_at").defaultNow()
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
}));

// Drizzle-zod
export const usersInsertSchema = createInsertSchema(users)
export const userSelectSchema = createSelectSchema(users)