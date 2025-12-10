import { bookRepository } from "../books/book.repository";
import { statsRepository } from "./stats.repository";

export const statsService = {
    getStats: async () => statsRepository.getStatsHome(),
    getTopBooks: async ({ category, limit = 3 }: {
        category: string | null;
        limit: number;
    }) => {
        if (!category) return bookRepository.findTopBooks(3)
        return statsRepository.get3TopBooks({ category, limit })
    }
}