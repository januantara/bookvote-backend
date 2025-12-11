import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './modules/auth/auth.routes'
import booksRouter from './modules/books/book.routes'
import votesRouter from './modules/votes/vote.routes'
import statsRouter from './modules/stats/stats.route'

const app = new Hono()
const api = new Hono()

app.use(cors({
  origin: ['http://localhost:3000', 'https://bookvote.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.json({
    name: "BookVote API",
    version: "1.0.0",
    description: "A RESTful API for book voting system",
    baseUrl: "https://bookvote-api.vercel.app/api",
    documentation: "https://github.com/januantara/bookvote-backend",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register a new user",
        "POST /api/auth/login": "Login and get access token",
        "POST /api/auth/refresh": "Refresh access token",
        "POST /api/auth/logout": "Logout (requires auth)"
      },
      books: {
        "GET /api/books": "Get all books (with filters: search, category, sort, isPurchased)",
        "GET /api/books/top": "Get top voted books",
        "GET /api/books/purchased": "Get purchased books",
        "GET /api/books/:bookId": "Get book by ID",
        "POST /api/books": "Add a new book (requires auth)",
        "POST /api/books/fetch-info": "Fetch book info from URL (requires auth)"
      },
      votes: {
        "POST /api/votes/:bookId": "Vote for a book (requires auth)",
        "DELETE /api/votes/:bookId": "Remove vote from a book (requires auth)",
        "GET /api/votes/my-votes": "Get user's votes (requires auth)"
      }
    },
    categories: [
      "Novel",
      "Technology",
      "Management",
      "Accounting",
      "Communication",
      "Design",
      "Psychology"
    ]
  })
})

api.route('/auth', authRouter)
api.route('/books', booksRouter)
api.route('/votes', votesRouter)
api.route('/stats', statsRouter)

app.route('/api', api)

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
