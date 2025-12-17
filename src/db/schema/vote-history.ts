import { relations } from 'drizzle-orm';
import {
    integer,
    pgTable,
    timestamp,
    unique,
    uuid
} from "drizzle-orm/pg-core";
import { books } from "./books";
import { users } from "./users";

// Vote History Table
export const voteHistory = pgTable("vote_history", {
    id: uuid("id").defaultRandom().notNull().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    bookId: integer("book_id")
        .notNull()
        .references(() => books.id, { onDelete: "cascade" }),
    votedAt: timestamp("voted_at").defaultNow()
},
    (table) => [
        unique().on(table.userId, table.bookId),
    ]
);

export const voteHistoryRelations = relations(voteHistory, ({ one }) => ({
    book: one(books, {
        fields: [voteHistory.bookId],
        references: [books.id],
    }),
    user: one(users, {
        fields: [voteHistory.userId],
        references: [users.id],
    }),
}));