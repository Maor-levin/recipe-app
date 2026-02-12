# Installation Guide

Complete setup instructions for the Recipe App.

## Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** for cloning the repository
- API keys for:
  - OpenRouter (for AI recipe variants)
  - Cloudinary (for image uploads)

## Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd recipe-app
```

## Step 2: Environment Setup

### Backend Configuration

Copy the example environment file:

```bash
cp backend/env.example backend/.env
```

Edit `backend/.env` with your values:

```bash
# Database
DATABASE_URL=postgresql://recipe_user:recipe_password@db:5432/recipe_db

# JWT Authentication
SECRET_KEY=your_secret_key_here  # Generate with: python3 -c 'import secrets; print(secrets.token_hex(32))'
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (JSON array format)
CORS_ORIGINS_LIST=["http://localhost:5173"]
# Production: CORS_ORIGINS_LIST=["https://yourdomain.com", "https://www.yourdomain.com"]

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct

# Debug Mode (optional, enables SQL logging)
# DEBUG=True
```

### PostgreSQL Configuration

Copy the example environment file:

```bash
cp postgres.env.example postgres.env
```

Edit `postgres.env`:

```bash
# PostgreSQL
POSTGRES_USER=recipe_user
POSTGRES_PASSWORD=recipe_password
POSTGRES_DB=recipe_db
```

## Step 3: Generate Secret Key

Generate a secure JWT secret key:

```bash
python3 -c 'import secrets; print(secrets.token_hex(32))'
```

Copy the output and paste it into `backend/.env` as `SECRET_KEY`.

## Step 4: Get API Keys

### OpenRouter API Key

1. Visit https://openrouter.ai/
2. Sign up or log in
3. Go to https://openrouter.ai/keys
4. Create a new API key
5. Add credits to your account (required for paid models)
6. Copy the key to `OPENROUTER_API_KEY` in `backend/.env`

### Cloudinary Account

1. Visit https://cloudinary.com/
2. Sign up for a free account
3. Go to Dashboard → Settings
4. Copy your:
   - Cloud Name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`

## Step 5: Launch the Application

Start all services with Docker Compose:

```bash
docker-compose up --build
```

This will:
- Build the backend Docker image
- Start PostgreSQL database
- Start the FastAPI backend
- Start the React frontend
- Start Adminer (database admin UI)

## Step 6: Access the Application

Once all containers are running:

- 🌐 **Frontend**: http://localhost:5173
- 📚 **API Documentation**: http://localhost:8000/docs
- 🗄️ **Database Admin (Adminer)**: http://localhost:8080

## Development Workflow

### Run Backend Only

```bash
docker-compose up backend db adminer
```

### Run Frontend Locally (Faster Development)

```bash
cd frontend-v2
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and connect to the backend running in Docker.

### Database Reset

To reset the database (removes all data):

```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, check what's using the ports:

```bash
# Check port 5173 (frontend)
lsof -i :5173

# Check port 8000 (backend)
lsof -i :8000

# Check port 5432 (PostgreSQL)
lsof -i :5432
```

Stop the conflicting service or change ports in `docker-compose.yml`.

### Database Connection Errors

1. Ensure PostgreSQL container is running: `docker-compose ps`
2. Check `DATABASE_URL` in `backend/.env` matches `postgres.env` credentials
3. Verify the database container is healthy: `docker-compose logs db`

### API Key Errors

- **OpenRouter**: Ensure you've added credits to your account
- **Cloudinary**: Verify all three values (cloud name, API key, API secret) are correct

### Frontend Not Loading

1. Check backend is running: `docker-compose ps`
2. Verify CORS settings in `backend/.env` include your frontend URL
3. Check browser console for errors

---

**Need Help?** Check the main [README](../README.md) or [Architecture Overview](./ARCHITECTURE.md) for more details.
