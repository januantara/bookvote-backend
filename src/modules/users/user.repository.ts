import { db } from "../../config/db";
import { and, eq } from "drizzle-orm";

export const userRepository = {
    getRequestedBooks: async (userId: string) =>
        db.query.books.findMany({
            where: (b) => eq(b.requestedBy, userId),
        }),
    getPurchasedBooks: async (userId: string) =>
        db.query.books.findMany({
            where: (b) => and(
                eq(b.isPurchased, true),
                eq(b.requestedBy, userId)
            ),
        }),
    getUserVotes: async (userId: string) =>
        db.query.voteHistory.findMany({
            where: (v) => eq(v.userId, userId),
            with: {
                book: true
            }
        }),
}   
