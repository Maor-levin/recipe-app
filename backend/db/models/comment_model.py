from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func, Text, ForeignKey

if TYPE_CHECKING:
    from .user_model import User
    from .recipe_model import Recipe


class CommentBase(SQLModel):
    content: str = Field(min_length=1, max_length=2000)


class CommentCreate(CommentBase):
    pass


class CommentOut(CommentBase):
    id: int
    created_at: datetime
    user_id: Optional[int]
    recipe_id: int
    author_name: str


class Comment(CommentBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    content: str = Field(min_length=1, max_length=2000, sa_column=Column(Text))
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now()))
    
    user_id: Optional[int] = Field(default=None, sa_column=Column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True))
    recipe_id: int = Field(sa_column=Column(ForeignKey("recipe.id", ondelete="CASCADE"), nullable=False))
    
    author: Optional["User"] = Relationship(back_populates="comments")
    recipe: "Recipe" = Relationship(back_populates="comments")

