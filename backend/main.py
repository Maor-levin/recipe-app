from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.connection import create_db_and_tables
from routes.user_routes import router as user_routes
from routes.recipe_routes import router as recipe_routes
from routes.auth_routes import router as auth_routes
from routes.comment_routes import router as comment_routes
from routes.note_routes import router as note_routes
from routes.favorite_routes import router as favorite_routes
from routes.upload_routes import router as upload_routes
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield  


app = FastAPI(lifespan=lifespan)


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

