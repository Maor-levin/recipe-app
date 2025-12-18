from datetime import datetime
from typing import TYPE_CHECKING, List, Literal, Optional, Union
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func, String
from sqlalchemy.dialects.postgresql import JSONB


if TYPE_CHECKING:
    from .user_model import User
    from .comment_model import Comment
    from .note_model import Note


class SubtitleBlock(SQLModel):
    type: Literal["subtitle"] = "subtitle"
    text: str


class TextBlock(SQLModel):
    type: Literal["text"] = "text"
    text: str


class ListBlock(SQLModel):
    type: Literal["list"] = "list"
    items: List[str]


class ImageBlock(SQLModel):
    type: Literal["image"] = "image"
    url: str


RecipeBlock = Union[SubtitleBlock, TextBlock, ListBlock, ImageBlock]


class RecipeBase(SQLModel):
    title: str
    description: str = ""
    thumbnail_image_url: Optional[str] = None
    recipe: List[RecipeBlock] = Field(default_factory=list, sa_column=Column(JSONB))


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_image_url: Optional[str] = None
    recipe: Optional[List[RecipeBlock]] = None


class RecipeOut(RecipeBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
    
    
class Recipe(RecipeBase, table=True):
    id: int = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    thumbnail_image_url: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True),nullable=False,server_default=func.now()))
    updated_at: datetime = Field(sa_column=Column(DateTime(timezone=True),nullable=False,server_default=func.now(),onupdate=func.now()))
    author: "User" = Relationship(back_populates="recipes")
    comments: List["Comment"] = Relationship(back_populates="recipe")
    notes: List["Note"] = Relationship(back_populates="recipe")
