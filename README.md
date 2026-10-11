# Todo App

A full-stack Todo application built with React, Node.js, Express, MySQL, and Docker.

This project demonstrates a simple CRUD workflow with a clean frontend and a REST API connected to a MySQL database.

## Tech stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL 8
- Containerization: Docker Compose

## Features

- View all todo items
- Add a new todo
- Edit a todo from an in-app popup modal
- Delete a todo
- Toggle complete/incomplete state
- Loading and empty states
- Error handling for failed requests
- Mobile responsive layout
- Dockerized local development setup

## Project structure

```text
todo/
├── backend/
│   ├── .env
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── wait-for-db.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── todoController.js
│   ├── db/
│   │   └── init.sql
│   └── routes/
│       └── todos.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/
│       │   └── todos.js
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Prerequisites

- Docker Desktop or Docker Engine installed
- A working local environment for Docker

## Environment variables

The backend environment file is located at `backend/.env` and currently contains:

```env
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=rootpassword
MYSQL_DATABASE=todo_db
PORT=5001
```

## Run locally

From the project root:

```bash
cd /Users/sandaruabenayake/Developer/todo
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api/todos

## API endpoints

### GET /api/health
Returns the server health status.

### GET /api/todos
Returns all todo items sorted by newest first.

### GET /api/todos/:id
Returns one todo item by ID.

### POST /api/todos
Creates a new todo.

Example request body:

```json
{
  "title": "Learn Docker"
}
```

### PUT /api/todos/:id
Updates a todo item.

### DELETE /api/todos/:id
Deletes a todo item.

### POST /api/todos/:id/toggle
Toggles the completed state.

## Database schema

The MySQL table is created automatically by `backend/db/init.sql`:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Docker notes

- MySQL is started by Docker Compose on port `3306`
- The backend waits for MySQL to become ready before starting Express
- The frontend runs through Vite and is exposed on port `5173`
- Data is stored in a Docker named volume called `mysql_data`

## Common commands

### Stop the app

```bash
docker compose down
```

### Stop and remove database data

```bash
docker compose down -v
```

### View logs

```bash
docker compose logs -f
```

## Troubleshooting

### Backend fails to start

This usually happens when the expected DB wait script is missing or Docker has not finished starting MySQL.

Check:

```bash
docker compose logs -f backend
```

### Frontend does not load

Verify port `5173` is free and the frontend container is running:

```bash
docker compose ps
```

### Port already in use

Stop local services using ports `3306`, `5001`, or `5173`.

## Notes

This project is intentionally simple and beginner-friendly. It is a good example of:

- full-stack CRUD application architecture
- Express route/controller separation
- MySQL integration with `mysql2/promise`
- Docker Compose orchestration
- React state-driven UI updates
- REST API communication from frontend to backend
