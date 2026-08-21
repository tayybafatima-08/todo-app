# Todo App

A full-stack Todo application built with React, Express, Prisma, and PostgreSQL.

## Live App
- **Frontend:** https://todo-app-tau-one-71.vercel.app
- **Backend API:** https://todo-app-production-b51b.up.railway.app

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (via Docker)

## Features
- Create, view, update (toggle complete), and delete todos
- Data persists in PostgreSQL — changes survive page refresh

## Project Structure
```
your-todo-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   └── index.js
│   ├── docker-compose.yml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

## Setup & Run Locally

### 1. Start the database
```bash
cd backend
docker compose up -d
```

### 2. Configure environment variables
Create a `.env` file inside `backend/`:
```
DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_db?schema=public"
PORT=5000
```

### 3. Install dependencies & run migrations
```bash
cd backend
npm install
npx prisma migrate dev --name init
```

### 4. Start the backend
```bash
node src/index.js
```
Runs on `http://localhost:5000`

### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/todos` | Create a new todo |
| GET | `/todos` | Get all todos |
| GET | `/todos/:id` | Get a single todo |
| PATCH | `/todos/:id` | Update a todo (e.g. toggle completed) |
| DELETE | `/todos/:id` | Delete a todo |
