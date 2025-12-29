from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func, UniqueConstraint

if TYPE_CHECKING:
    from .user_model import User
    from .recipe_model import Recipe


class FavoriteBase(SQLModel):
    pass


class FavoriteCreate(FavoriteBase):
    pass


class FavoriteOut(FavoriteBase):
    id: int
    user_id: int
    recipe_id: int
    created_at: datetime


class Favorite(FavoriteBase, table=True):
    __table_args__ = (
        UniqueConstraint("user_id", "recipe_id", name="unique_user_recipe_favorite"),
    )
    
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now()))
    
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    recipe_id: int = Field(foreign_key="recipe.id", ondelete="CASCADE")
    
    user: "User" = Relationship(back_populates="favorites")
    recipe: "Recipe" = Relationship(back_populates="favorited_by")

