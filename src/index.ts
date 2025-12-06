import { Hono } from 'hono'
import authRouter from './modules/auth/auth.routes'
import booksRouter from './modules/books/book.routes'
import votesRouter from './modules/votes/vote.routes'

const app = new Hono()
const api = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

api.route('/auth', authRouter)
api.route('/books', booksRouter)
api.route('/votes', votesRouter)

app.route('/api', api)

export default app
