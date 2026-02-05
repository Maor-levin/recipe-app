# 🍽️ Recipe App

A modern, full-stack recipe sharing platform that solves the challenge of discovering and adapting recipes for dietary needs. Combines AI-powered recipe transformation with a flexible block-based editor, enabling users to easily customize recipes (vegan, gluten-free, etc.) and share culinary creations with a community. Built with clean architecture, organized codebase, and contemporary web development practices.

## ✨ Key Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 🤖 **AI-Powered Recipe Variants** - Transform recipes (vegan, gluten-free, etc.) using OpenRouter API
- 📝 **Block-Based Recipe Editor** - Flexible content blocks (text, lists, images, subtitles)
- 🖼️ **Image Upload** - Cloudinary integration for recipe images with automatic optimization
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
- **OpenRouter API** - AI integration for recipe variant generation (Llama 3.3 70B)
- **Cloudinary** - Cloud-based image storage and optimization

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
├── routes/         # API endpoints
└── services/       # Business logic (AI service, etc.)

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
# Required: CLOUDINARY_* (for image uploads)
# Required: OPENROUTER_API_KEY (for AI recipe variants)
```

2. **Launch application:**

```bash
docker-compose up --build
```

3. **Access the application:**

- 🌐 Frontend: http://localhost:5173
- 📚 API Docs: http://localhost:8000/docs
- 🗄️ Database Admin: http://localhost:8080

### Required Environment Variables

**Backend (`backend/.env`):**
- `DATABASE_URL` - PostgreSQL connection string (format: `postgresql://user:password@db:5432/dbname`)
- `SECRET_KEY` - JWT secret key (generate with: `python3 -c 'import secrets; print(secrets.token_hex(32))'`)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - JWT token expiration time (default: 30)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `OPENROUTER_API_KEY` - OpenRouter API key for AI recipe variants
- `OPENROUTER_MODEL` - (Optional) LLM model to use (default: `meta-llama/llama-3.3-70b-instruct:free`)
- `CORS_ORIGINS_LIST` - (Optional) Comma-separated list of allowed origins (default: localhost)

**PostgreSQL (`postgres.env`):**
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name

## 🔑 Key Technical Decisions

- **SQLModel over raw SQLAlchemy** - Type safety and Pydantic validation
- **Component organization** - Scalable folder structure by feature
- **Auto-save with debounce** - Better UX without performance overhead
- **Axios interceptors** - Centralized auth and error handling
- **React Context API** - Centralized authentication state without prop drilling
- **OpenRouter for AI** - Flexible LLM access with multiple model options
- **Cloudinary for images** - Automatic optimization and CDN delivery
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

- [x] ~~AI-powered recipe variants~~ ✅ Implemented
- [x] ~~Image upload with cloud storage~~ ✅ Implemented
- [ ] Recipe ratings and reviews
- [ ] Advanced search with filters
- [ ] Social features (follow users)

---

© 2025 - All Rights Reserved Maor Levin
