import { Hono } from "hono";
import { addBook, getBookById, getBookInfoByURL, getBooks, getPurchasedBooks, getTopBooks } from "./book.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isRole } from "../../middlewares/role.middleware";

const booksRouter = new Hono();

// Public routes
booksRouter.get('/', getBooks)
booksRouter.get('/top', getTopBooks)
booksRouter.get('/purchased', getPurchasedBooks)
booksRouter.get('/:bookId', getBookById)

// Protected routes
booksRouter.post('/', authMiddleware, isRole("voter"), addBook)
booksRouter.post('/fetch-info', authMiddleware, isRole("voter"), getBookInfoByURL)

export default booksRouter;