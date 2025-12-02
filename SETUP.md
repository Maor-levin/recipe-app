# Recipe App Setup Guide

## Environment Variables

### Backend Configuration

Create a `.env` file in the `backend/` directory with:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@db:5432/recipe_db

# JWT Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory with:

```env
# API Configuration
VITE_API_URL=http://localhost:8000
```

### PostgreSQL Configuration

Create a `postgres.env` file in the root directory with:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=recipe_db
```

## Running the Application

### Using Docker Compose (Recommended)

```bash
docker-compose up --build
```

This will start:
- Backend API on http://localhost:8000
- PostgreSQL database
- Adminer (database admin) on http://localhost:8080

### Running Frontend Separately

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173

## Authentication

The app now includes JWT authentication:
- Click "Login" button in the navbar
- Toggle between Login and Register
- After login, you'll see your username with a dropdown menu
- Protected routes: creating recipes, deleting recipes

## Default Ports

- Backend API: 8000
- Frontend Dev Server: 5173
- PostgreSQL: 5432
- Adminer: 8080

