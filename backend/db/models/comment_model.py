from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func

if TYPE_CHECKING:
    from .user_model import User
    from .recipe_model import Recipe


class CommentBase(SQLModel):
    content: str


class CommentCreate(CommentBase):
    pass


class CommentOut(CommentBase):
    id: int
    created_at: datetime
    user_id: int
    recipe_id: int
    author_name: str


class Comment(CommentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now()))
    
    user_id: int = Field(foreign_key="user.id")
    recipe_id: int = Field(foreign_key="recipe.id")
    
    author: "User" = Relationship(back_populates="comments")
    recipe: "Recipe" = Relationship(back_populates="comments")

