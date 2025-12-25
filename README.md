# Recipe App

A full-stack recipe sharing platform with JWT authentication, demonstrating modern web development practices and Docker orchestration.

## Features

- 🔐 JWT authentication (register/login)
- 📝 Create, edit, delete recipes with rich block-based content
- 💬 Public comments on recipes
- 📓 Private personal notes for each recipe
- 🎨 Modern responsive UI with Tailwind CSS
- 🐳 Fully containerized with Docker

## Tech Stack

**Backend:**
- FastAPI (Python)
- PostgreSQL
- SQLModel
- JWT Authentication

**Frontend:**
- React 19
- Vite
- React Router
- Tailwind CSS
- Axios

**DevOps:**
- Docker & Docker Compose
- Multi-version frontend deployment

## Quick Start

See [SETUP.md](SETUP.md) for detailed instructions.

```bash
# 1. Set up environment
cp postgres.env.example postgres.env
cp backend/env.example backend/.env
# Edit both files

# 2. Run everything
docker-compose up --build
```

Access at http://localhost:5173

## Project Structure

```
recipe-app/
├── backend/          # FastAPI backend
├── frontend-v1/      # React frontend (current)
├── frontend-v2/      # React frontend (new - in development)
├── docker-compose.yml
└── SETUP.md
```

## API Documentation

When running, visit: http://localhost:8000/docs

## License

MIT

