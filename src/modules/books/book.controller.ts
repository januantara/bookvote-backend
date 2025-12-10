import { Context } from "hono";
import { BookFilterProps } from "./book.repository";
import { bookService } from "./book.service";
import { AddBookSchema } from "./book.validation";
import { voteRepository } from "../votes/vote.repository";

export async function getBooks(c: Context) {
    const {
        search,
        category,
        sort = "newest",
        isPurchased = false
    } = c.req.query() as BookFilterProps;

    const books = await bookService.getBooks({ search, category, sort, isPurchased });
    if (books.length === 0) return c.json({ error: "There are no books available for voting" }, 404);

    return c.json(books);
}


export async function getBookInfoByURL(c: Context) {
    const { url } = await c.req.json();
    if (!url) return c.json({ error: "URL required" }, 400);

    const bookInfo = await bookService.getBookInfoByURL(url);
    if ('error' in bookInfo) return c.json({ error: bookInfo.error }, bookInfo.status)

    return c.json(bookInfo);
}


export async function getTopBooks(c: Context) {
    const topBooks = await bookService.getTopBooks()
    if (topBooks.length === 0) return c.json({ error: "No top books available" }, 404)

    return c.json(topBooks)
}


export async function addBook(c: Context) {
    const body = await c.req.json();
    const parsed = AddBookSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
    }

    const existing = await bookService.getBookByName(parsed.data.title);
    if (existing && existing.length > 0) {
        return c.json({ error: "A book with that title already exists" }, 409);
    }

    const newBook = await bookService.addBook(parsed.data);
    await voteRepository.vote(parsed.data.requestedBy, newBook[0].id);

    return c.json(newBook, 201);
}


export async function getBookById(c: Context) {
    const { bookId } = c.req.param();
    const book = await bookService.getBookById(Number(bookId));

    if (!book) return c.json({ error: "Book not found" }, 404);

    return c.json(book);
}

export async function getPurchasedBooks(c: Context) {
    const purchasedBooks = await bookService.getPurchasedBooks();

    if (purchasedBooks.length === 0) return c.json({ error: "No purchased books available" }, 404);
    return c.json(purchasedBooks);
}