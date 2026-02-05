from datetime import datetime
from typing import TYPE_CHECKING, List, Literal, Optional, Union
from pydantic import BaseModel, field_validator
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import (
    Column,
    DateTime,
    Field,
    ForeignKey,
    Relationship,
    SQLModel,
    String,
    Text,
    func,
)

if TYPE_CHECKING:
    from .comment_model import Comment
    from .favorite_model import Favorite
    from .note_model import Note
    from .recipe_variant_model import RecipeVariant
    from .user_model import User


class SubtitleBlock(SQLModel):
    type: Literal["subtitle"] = "subtitle"
    text: str = Field(min_length=1, max_length=200)


class TextBlock(SQLModel):
    type: Literal["text"] = "text"
    text: str = Field(min_length=1, max_length=10000)


class ListBlock(SQLModel):
    type: Literal["list"] = "list"
    items: List[str] = Field(min_length=1)
    
    @field_validator('items')
    @classmethod
    def validate_items(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError('List must have at least one item')
        for item in v:
            if len(item) > 500:
                raise ValueError('List item cannot exceed 500 characters')
        return v


class ImageBlock(SQLModel):
    type: Literal["image"] = "image"
    url: str = Field(max_length=2048)
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: str) -> str:
        # Allow empty URLs (user might not have uploaded yet)
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('Image URL must start with http:// or https://')
        return v


RecipeBlock = Union[SubtitleBlock, TextBlock, ListBlock, ImageBlock]


class RecipeBase(SQLModel):
    title: str = Field(min_length=3, max_length=200, sa_column=Column(String(200)))
    description: str = Field(default="", max_length=1000, sa_column=Column(String(1000)))
    thumbnail_image_url: Optional[str] = Field(default=None, max_length=2048)
    recipe: List[RecipeBlock] = Field(default_factory=list, sa_column=Column(JSONB))
    
    @field_validator('thumbnail_image_url')
    @classmethod
    def validate_thumbnail_url(cls, v: Optional[str]) -> Optional[str]:
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('Thumbnail URL must start with http:// or https://')
        return v


class RecipeCreate(RecipeBase):
    pass


class RecipeUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    thumbnail_image_url: Optional[str] = None
    recipe: Optional[List[RecipeBlock]] = None


class RecipeAuthor(SQLModel):
    user_name: str
    
class RecipeOut(RecipeBase):
    id: int
    author_id: int
    created_at: datetime
    updated_at: datetime
    author: Optional[RecipeAuthor] = None
    
    class Config:
        from_attributes = True
    
    
class Recipe(RecipeBase, table=True):
    
    # Identity & ownership
    id: int = Field(default=None, primary_key=True)
    author_id: int = Field(
        sa_column=Column(
            ForeignKey("user.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    # Core content fields (duplicate base fields with concrete column defs)
    title: str = Field(
        min_length=3,
        max_length=200,
        sa_column=Column(String(200)),
    )
    description: str = Field(
        default="",
        max_length=1000,
        sa_column=Column(String(1000)),
    )
    thumbnail_image_url: Optional[str] = Field(
        default=None,
        max_length=2048,
        sa_column=Column(String(2048), nullable=True),
    )

    # Timestamps
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
            onupdate=func.now(),
        )
    )

    # Relationships
    author: "User" = Relationship(back_populates="recipes")

    comments: List["Comment"] = Relationship(
        back_populates="recipe",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    notes: List["Note"] = Relationship(
        back_populates="recipe",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    favorited_by: List["Favorite"] = Relationship(
        back_populates="recipe",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    variants: List["RecipeVariant"] = Relationship(
        back_populates="original_recipe",
        sa_relationship_kwargs={"passive_deletes": True},
    )
