import { db } from "../../config/db";
import { books } from "../../db/schema";
import { eq, ilike, and, or, desc, asc } from "drizzle-orm";
import { AddBookDataProps, BookCategoryProps } from "./book.validation";

export interface BookFilterProps {
    search?: string;
    category?: "Novel" | "Technology" | "Management" | "Accounting" | "Communication" | "Design" | "Psychology";
    sort?: "most_voted" | "newest" | "oldest";
    isPurchased?: boolean;
}

export const bookRepository = {

    findAllWithFilters: async ({
        search,
        category,
        sort,
        isPurchased
    }: BookFilterProps) => {

        let query: any = db.select().from(books);

        // Build WHERE conditions
        const whereConditions = [];

        // SEARCH (title or author)
        if (search) {
            whereConditions.push(
                or(
                    ilike(books.title, `%${search}%`),
                    ilike(books.author, `%${search}%`)
                )
            );
        }

        // FILTER CATEGORY
        if (category) whereConditions.push(eq(books.category, category));

        // FILTER PURCHASED BOOKS
        if (isPurchased === true) whereConditions.push(eq(books.isPurchased, true));

        // Apply conditions
        if (whereConditions.length > 0) {
            query = query.where(
                whereConditions.length === 1
                    ? whereConditions[0]
                    : and(...whereConditions)
            );
        }

        // SORT
        if (sort === "most_voted") query = query.orderBy(desc(books.voteCount));
        if (sort === "newest") query = query.orderBy(desc(books.createdAt));
        if (sort === "oldest") query = query.orderBy(asc(books.createdAt));

        return query;
    },

    findTopBooks: async (limit: number = 10) => db.select().from(books).orderBy(desc(books.voteCount)).limit(limit),
    findTopBooksByCategory: async (category: string, limit: number = 10) => (
        db.select().from(books)
            .where(eq(books.category, category as BookCategoryProps))
            .orderBy(desc(books.voteCount))
            .limit(limit)
    ),
    findById: async (bookId: number) => db.select().from(books).where(eq(books.id, Number(bookId))),
    findByName: async (title: string) => db.select().from(books).where(eq(books.title, title)).limit(1),
    getPurchasedBooks: async () => db.select().from(books).where(eq(books.isPurchased, true)),

    // Add a new book
    add: async (data: AddBookDataProps) => {
        const newBook = await db.insert(books).values(data).returning();
        return newBook;
    }
};
