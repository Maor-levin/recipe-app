from sqlmodel import SQLModel, Session, create_engine
from core.config import settings
from db.models.user_model import User, UserCreate, UserOut

engine = create_engine(settings.DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session