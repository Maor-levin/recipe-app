from sqlmodel import SQLModel, Session, create_engine
from core.config import settings

from db.models import (  
    User,
    Recipe,
    Comment,
    Note,
    Favorite,
    RecipeVariant,
)

engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG)


def create_db_and_tables():
    """Create all database tables defined in SQLModel models."""
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session