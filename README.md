# 📚 BookVote API

A RESTful API for a book voting system built with **Hono**, **Drizzle ORM**, and **Bun**. Users can register, login, add books, and vote for their favorite books.

**🌐 Base URL:** `https://bookvote-api.vercel.app`

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) runtime installed

### Installation
```sh
bun install
```

### Development
```sh
bun run dev
```

Open http://localhost:3000

---

## 🛠️ Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Authentication:** JWT (jose)
- **Deployment:** Vercel

---

## 📖 API Documentation

### Base URL
```
https://bookvote-api.vercel.app/api
```

---

## 🔐 Authentication

### Register
Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullname` | string | Yes | Full name (min 3 characters) |
| `email` | string | Yes | Valid email address |
| `nim` | string | Yes | Student ID (6-20 characters) |
| `password` | string | Yes | Password (min 8 characters) |
| `role` | string | No | User role: `voter` or `staff` (default: `voter`) |

**Example Request:**
```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "nim": "123456",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully"
}
```

---

### Login
Authenticate user and receive access token.

```http
POST /api/auth/login
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `nim` | string | Yes | Student ID |
| `password` | string | Yes | User password |

**Example Request:**
```json
{
  "nim": "123456",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "fullname": "John Doe",
    "email": "john@example.com",
    "nim": "123456",
    "role": "voter"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 💡 **Note:** A `refresh_token` cookie is also set (httpOnly, secure).

---

### Refresh Token
Get a new access token using refresh token.

```http
POST /api/auth/refresh
```

**Headers:**
- Cookie: `refresh_token` (automatically sent if set)

**Response (200):**
```json
{
  "message": "Token successfully refreshed",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout
Invalidate the current session.

```http
POST /api/auth/logout
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 📚 Books

### Get All Books
Retrieve a list of all books with optional filters.

```http
GET /api/books
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by book title |
| `category` | string | Filter by category |
| `sort` | string | Sort order: `newest` (default) |
| `isPurchased` | boolean | Filter by purchase status |

**Available Categories:**
- `Novel`
- `Technology`
- `Management`
- `Accounting`
- `Communication`
- `Design`
- `Psychology`

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "imageUrl": "https://example.com/image.jpg",
    "author": "Robert C. Martin",
    "description": "A Handbook of Agile Software Craftsmanship",
    "category": "Technology",
    "isPurchased": false,
    "voteCount": 15,
    "color": "#2563eb",
    "requestedBy": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Top Books
Get books sorted by highest vote count.

```http
GET /api/books/top
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "voteCount": 25
    // ... other book fields
  }
]
```

---

### Get Purchased Books
Get all books that have been purchased.

```http
GET /api/books/purchased
```

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "isPurchased": true,
    "purchasedAt": "2024-01-15T00:00:00.000Z"
    // ... other book fields
  }
]
```

---

### Get Book by ID
Retrieve a specific book by its ID.

```http
GET /api/books/:bookId
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Clean Code",
  "imageUrl": "https://example.com/image.jpg",
  "author": "Robert C. Martin",
  "description": "A Handbook of Agile Software Craftsmanship",
  "category": "Technology",
  "isPurchased": false,
  "voteCount": 15,
  "color": "#2563eb",
  "requestedBy": "uuid",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Add Book
Add a new book to the voting list. *(Requires authentication)*

```http
POST /api/books
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Book title |
| `author` | string | Yes | Book author |
| `category` | string | Yes | Book category |
| `color` | string | Yes | Theme color (hex) |
| `imageUrl` | string | Yes | Cover image URL |
| `requestedBy` | string | Yes | User ID who requested |
| `description` | string | Yes | Book description |

**Example Request:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Technology",
  "color": "#2563eb",
  "imageUrl": "https://example.com/cover.jpg",
  "requestedBy": "uuid-user-id",
  "description": "A Handbook of Agile Software Craftsmanship"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Clean Code",
  // ... all book fields
}
```

---

### Fetch Book Info by URL
Scrape book information from a URL. *(Requires authentication)*

```http
POST /api/books/fetch-info
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Request Body:**
```json
{
  "url": "https://example-bookstore.com/book/123"
}
```

**Response (200):**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "imageUrl": "https://example.com/cover.jpg",
  "description": "Book description..."
}
```

---

## 🗳️ Votes

### Vote for a Book
Add or update a vote for a book. *(Requires authentication)*

```http
POST /api/votes/:bookId
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Request Body:**
```json
{
  "bookId": 1
}
```

**Response (200):**
```json
{
  "message": "Vote updated successfully",
  "vote": {
    // vote details
  }
}
```

---

### Remove Vote
Remove a vote from a book. *(Requires authentication)*

```http
DELETE /api/votes/:bookId
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Request Body:**
```json
{
  "bookId": 1
}
```

**Response (200):**
```json
{
  "message": "Vote updated successfully",
  "vote": {
    // vote details
  }
}
```

---

### Get User's Votes
Get all books voted by the authenticated user. *(Requires authentication)*

```http
GET /api/votes/my-votes
```

**Headers:**
| Header | Value |
|--------|-------|
| `Authorization` | `Bearer <accessToken>` |

**Response (200):**
```json
{
  "message": "User votes retrieved successfully",
  "votes": [
    {
      // voted book details
    }
  ]
}
```

---

## ❌ Error Responses

All endpoints may return the following error formats:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized: Lakukan login terlebih dahulu"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**409 Conflict:**
```json
{
  "error": "Resource already exists"
}
```

---

## 🔑 Authentication Notes

- Access tokens are short-lived JWT tokens
- Refresh tokens are stored in httpOnly cookies and valid for 7 days
- Protected endpoints require the `Authorization: Bearer <token>` header
- Role-based access: Some endpoints require `voter` role

---

## 📝 License

This project is open source and available under the MIT License.
