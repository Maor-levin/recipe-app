from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func, UniqueConstraint

if TYPE_CHECKING:
    from .user_model import User
    from .recipe_model import Recipe


class NoteBase(SQLModel):
    content: str


class NoteCreate(NoteBase):
    pass


class NoteOut(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime
    recipe_id: int


class Note(NoteBase, table=True):
    __table_args__ = (
        UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe_note"),
    )
    
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now()))
    
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    recipe_id: int = Field(foreign_key="recipe.id", ondelete="CASCADE")
    
    owner: "User" = Relationship(back_populates="notes")
    recipe: "Recipe" = Relationship(back_populates="notes")

