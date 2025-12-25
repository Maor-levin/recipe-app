# Recipe App Setup Guide

## Quick Start

**1. Set up environment files:**

```bash
cp postgres.env.example postgres.env
cp backend/env.example backend/.env
# Edit both files with your values
```

**2. Run the application:**

```bash
docker-compose up --build
```

**Access:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/docs
- Adminer (DB): http://localhost:8080

---

## Alternative: Frontend Local (Faster Development)

```bash
# Terminal 1 - Backend only
docker-compose up backend db adminer

# Terminal 2 - Frontend locally
cd frontend-v1 && npm install && npm run dev
```

---

## Switching Frontend Versions

Edit `docker-compose.yml` lines 4 & 6:

```yaml
build: ./frontend-v1 # Change to ./frontend-v2
volumes:
  - ./frontend-v1:/app # Change to ./frontend-v2:/app
```

Then: `docker-compose up --build`

---

## Ports

- Frontend: 5173
- Backend: 8000
- Database: 5432
- Adminer: 8080
