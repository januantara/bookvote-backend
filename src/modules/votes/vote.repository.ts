import { db } from '../../config/db';
import { eq, and, sql } from 'drizzle-orm';
import { books, voteHistory } from '../../db/schema';
import { AnyColumn } from 'drizzle-orm';

const increment = (column: AnyColumn, value = 1) => sql`${column} + ${value}`;
const decrement = (column: AnyColumn, value = 1) => sql`${column} - ${value}`;
type VoteOperation = typeof increment | typeof decrement;

const updateVoteCount = (bookId: number, operation: VoteOperation) =>
    db.update(books)
        .set({ voteCount: operation(books.voteCount) })
        .where(eq(books.id, bookId))
        .returning();


export const voteRepository = {
    findByUser: (userId: string) =>
        db.query.voteHistory.findMany({
            where: (v) => eq(v.userId, userId),
        }),

    findVotedBook: (userId: string, bookId: number) =>
        db.query.voteHistory.findFirst({
            where: (v) => and(eq(v.userId, userId), eq(v.bookId, bookId)),
        }),

    removeHistory: (userId: string, bookId: number) =>
        db.delete(voteHistory).where(and(
            eq(voteHistory.userId, userId),
            eq(voteHistory.bookId, bookId)
        )),

    addHistory: (userId: string, bookId: number) =>
        db.insert(voteHistory).values({ userId, bookId }),

    vote: async (userId: string, bookId: number) => {
        const hasVoted = await voteRepository.findVotedBook(userId, bookId);

        if (hasVoted) {
            await voteRepository.removeHistory(userId, bookId);
            return updateVoteCount(bookId, decrement);
        }

        await voteRepository.addHistory(userId, bookId);
        return updateVoteCount(bookId, increment);
    },
}