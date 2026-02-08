# Recipe App

> A full-stack recipe sharing platform with AI-powered dietary adaptations. Built with FastAPI, React 19, PostgreSQL, and Docker.

**[Live Demo](https://foodybubble.arkatony.duckdns.org/) | [Documentation](./documents/INDEX.md) | [GitHub](https://github.com/Maor-levin/recipe-app)**

---

## Why This Exists

Home cooks collect recipes from multiple platforms (Instagram, TikTok, websites) with no centralized way to organize them or adapt them for dietary needs. Manually modifying recipes often means repeatedly copying them into ChatGPT.

This platform centralizes recipe management, adds personal notes, and uses AI-powered transformations for things like vegan or gluten-free versions—backed by intelligent caching that reduces API costs by ~90%.

Built as a full-stack portfolio project showcasing production-ready architecture, scalability, and performance optimization.

---

## Technical Highlights

**Performance & Scalability:**
- **Cache-aside pattern** with normalized keys reducing AI API costs by ~90%
- PostgreSQL with JSONB for flexible data storage

**Architecture & Code Quality:**
- **Service layer pattern** separating business logic from routes
- **End-to-end type safety** using SQLModel with Pydantic validation
- **Comprehensive error handling** with structured logging (Loguru)
- **RESTful API** with 20+ endpoints and auto-generated documentation

**Key Features:**
- JWT authentication with bcrypt hashing
- AI-powered recipe variants (OpenRouter API)
- Block-based recipe editor
- Real-time search and filtering
- Image optimization via Cloudinary CDN
- Community features (comments)
- Personal organization (favorites, auto-saved notes per recipe)

---

## Tech Stack

**Backend:**  
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

FastAPI • PostgreSQL • SQLModel • OpenRouter AI • Cloudinary • Docker

**Frontend:**  
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

React 19 • Vite • Tailwind CSS • Axios • React Router

---

## Quick Start

**Prerequisites:** Docker & Docker Compose

```bash
# Clone and setup
git clone https://github.com/Maor-levin/recipe-app
cd recipe-app

# Configure environment
cp backend/env.example backend/.env
cp postgres.env.example postgres.env
# Edit .env files with your API keys (Cloudinary, OpenRouter)

# Launch
docker-compose up --build

# Access at http://localhost:5173
```

**Detailed Setup:** See [Installation Guide](./documents/INSTALL.md)

---

## Project Structure

```
backend/
├── auth/          # JWT authentication
├── services/      # Business logic (AI, caching)
├── routes/        # API endpoints
├── db/models/     # SQLModel entities
└── core/          # Configuration

frontend-v2/
├── components/    # React components (UI, modals, recipe, comments)
├── pages/         # Route pages
└── utils/         # API client, helpers
```

**Architecture Details:** See [Architecture Overview](./documents/ARCHITECTURE.md)

---

## Key Metrics

- **6 Database Tables** - Normalized schema with CASCADE relationships
- **20+ API Endpoints** - RESTful design with Pydantic validation
- **20+ React Components** - Reusable, well-structured UI
- **~5,000 Lines of Code** - Clean, maintainable, production-ready

---

## What I Learned

- Designing efficient caching strategies for external API calls
- Implementing service-layer architecture for maintainable codebases
- End-to-end type safety across database, API, and frontend
- Production considerations: logging, error handling, security best practices
- Docker orchestration for consistent development and deployment

---

## Documentation

- **[Installation Guide](./documents/INSTALL.md)** - Detailed setup instructions
- **[Architecture Overview](./documents/ARCHITECTURE.md)** - System design, database schema, and patterns
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (FastAPI auto-generated)

---

## Screenshots

<!-- Add screenshots here when available -->
<!-- Recommended: -->
<!-- - Home page with recipe feed -->
<!-- - Recipe editor with block-based interface -->
<!-- - AI variant generation in action -->
<!-- - Recipe detail page with comments -->

---

## About

**Built by Maor Levin** | 2025

Full-stack portfolio project demonstrating modern web development practices, clean architecture, and production-ready code.

**[GitHub](https://github.com/Maor-levin/recipe-app)**

---

© 2025 Maor Levin. All Rights Reserved.
