from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from db.connection import create_db_and_tables
from routes.user_routes import router as user_routes
from routes.recipe_routes import router as recipe_routes
from routes.auth_routes import router as auth_routes
from routes.comment_routes import router as comment_routes
from routes.note_routes import router as note_routes
from routes.favorite_routes import router as favorite_routes
from routes.upload_routes import router as upload_routes
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from core.config import settings
from core.logging_config import setup_logging
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Starting application")
    create_db_and_tables()
    logger.info("Database tables created")
    yield
    logger.info("Shutting down application")


app = FastAPI(
    title="Recipe App API",
    description="A modern recipe sharing platform with AI-powered variants",
    version="1.0.0",
    lifespan=lifespan,
)



@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch all unhandled exceptions."""
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again later."},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes)
app.include_router(user_routes)
app.include_router(recipe_routes)
app.include_router(comment_routes)
app.include_router(note_routes)
app.include_router(favorite_routes)
app.include_router(upload_routes)

