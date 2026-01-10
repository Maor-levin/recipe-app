# 🍽️ Recipe App

A modern, full-stack recipe sharing platform with clean architecture, organized codebase, and contemporary web development practices.

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **Block-Based Recipe Editor** - Flexible content blocks (text, lists, images, subtitles)
- 🔍 **Real-time Search** - Instant filtering across recipes
- ⭐ **Favorites System** - Bookmark recipes with personal notes
- 📓 **Auto-Save Notes** - Private note-taking with automatic persistence
- 💬 **Interactive Comments** - Public discussion with edit/delete capabilities
- 🎨 **Modern UI** - Clean interface with Tailwind CSS
- 🐳 **Containerized Deployment** - Full Docker orchestration

## 🛠️ Tech Stack

### Backend

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Relational database with CASCADE constraints
- **SQLModel** - Type-safe ORM with Pydantic validation
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

- **React 19** - Latest React with hooks
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling

### DevOps

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

- **Docker Compose** - Multi-container orchestration
- **Hot Reload** - Development with volume mounting
- **Adminer** - Database management UI

## 🏗️ Architecture Highlights

### Clean Code Organization

```
backend/
├── auth/           # Authentication utilities
├── core/           # Configuration
├── db/
│   └── models/     # SQLModel entities
└── routes/         # API endpoints

frontend-v2/
├── components/
│   ├── ui/         # Reusable UI components
│   ├── modals/     # Modal dialogs
│   ├── recipe/     # Recipe-specific components
│   ├── comments/   # Comment system
│   └── layout/     # App layout
├── pages/          # Route components
└── utils/          # Helpers & API client
```

### Database Design

- Proper foreign key relationships with CASCADE/SET NULL
- Pydantic validation at model level
- Unique constraints for data integrity
- Automatic timestamps

### Frontend Patterns

- Component-based architecture
- Custom reusable UI components
- Centralized API management
- Protected routes & auth flow
- Optimistic UI updates

## 🚀 Quick Start

**Prerequisites:** Docker & Docker Compose

1. **Clone and setup environment:**

```bash
git clone <your-repo>
cd recipe-app
cp postgres.env.example postgres.env
cp backend/env.example backend/.env
# Edit .env files with your values
```

2. **Launch application:**

```bash
docker-compose up --build
```

3. **Access the application:**

- 🌐 Frontend: http://localhost:5173
- 📚 API Docs: http://localhost:8000/docs
- 🗄️ Database Admin: http://localhost:8080

## 🔑 Key Technical Decisions

- **SQLModel over raw SQLAlchemy** - Type safety and Pydantic validation
- **Component organization** - Scalable folder structure by feature
- **Auto-save with debounce** - Better UX without performance overhead
- **Axios interceptors** - Centralized auth and error handling
- **Docker Compose** - Simplified deployment and development consistency

## 🧪 Development

### Run Backend Only

```bash
docker-compose up backend db adminer
```

### Run Frontend Locally (faster dev)

```bash
cd frontend-v2
npm install
npm run dev
```

### Database Reset

```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 20+
- **API Endpoints**: 20+
- **Database Tables**: 5
- **Docker Services**: 4

## 🎯 Future Enhancements

- [ ] AI-powered recipe variants (vegan, gluten-free, etc.)
- [ ] Image upload with cloud storage
- [ ] Recipe ratings and reviews
- [ ] Advanced search with filters
- [ ] Social features (follow users)

---

© 2025 - All Rights Reserved Maor Levin
