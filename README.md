# Personal-Notes-Bookmark-Manager

A full-stack MERN application for managing personal notes and bookmarks, featuring user authentication, RESTful APIs, and a modern React frontend styled with Tailwind CSS.

---

## Project Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file with your MongoDB URI and JWT secret
# Example .env:
# MONGODB_URI=mongodb://localhost:27017/notes_bookmarks
# JWT_SECRET=your_jwt_secret
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000).

---

## Brief API Documentation

### Auth
- **POST /api/auth/register** — Register a new user
- **POST /api/auth/login** — Login and receive JWT

### Notes
- **GET /api/notes** — Get all notes (auth required)
- **POST /api/notes** — Create a note (auth required)
- **PUT /api/notes/:id** — Update a note (auth required)
- **DELETE /api/notes/:id** — Delete a note (auth required)

### Bookmarks
- **GET /api/bookmarks** — Get all bookmarks (auth required)
- **POST /api/bookmarks** — Create a bookmark (auth required)
- **PUT /api/bookmarks/:id** — Update a bookmark (auth required)
- **DELETE /api/bookmarks/:id** — Delete a bookmark (auth required)

---

## Sample cURL Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### Create Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Sample Note", "content": "This is a note."}'
```

### Create Bookmark
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Google", "url": "https://google.com"}'
```

---

## Skills This Tests

- **REST API Design:** Follows RESTful conventions for resource management.
- **Data Validation & Error Handling:** Validates input and handles errors gracefully on both backend and frontend.
- **React Routing & State Management:** Uses React (with Context API) for authentication and state, and React Router for navigation.
- **Tailwind CSS for UI:** Modern, responsive UI built with Tailwind CSS.
- **Clean Code & Structure:** Organized codebase with separation of concerns (controllers, models, routes, etc.).
- **Real-world Data Modeling:** MongoDB schemas for users, notes, and bookmarks.

---

## (Optional) Postman Collection
You can import the following endpoints into Postman for testing:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/notes`
- `GET/POST/PUT/DELETE /api/bookmarks`

---

Feel free to contribute or raise issues!