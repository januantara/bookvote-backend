import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { books, users, voteHistory } from "../../db/schema";
import { bookRepository } from "../books/book.repository";

export const statsRepository = {
    getStatsHome: async () => {
        const [communityPicks, votesCount, totalUsers] = await Promise.all([
            db.$count(books, eq(books.isPurchased, true)),
            db.$count(voteHistory),
            db.$count(users)
        ]);

        return {
            communityPicks,
            votesCount,
            totalUsers
        }
    },

    get3TopBooks: async ({ category, limit = 10 }: {
        category: string;
        limit: number;
    }) => {
        const topBooks = bookRepository.findTopBooksByCategory(category, limit);
        return topBooks;
    }
}