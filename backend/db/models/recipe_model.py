from datetime import datetime
from typing import TYPE_CHECKING, List, Union, Optional
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, func, String
from sqlalchemy.dialects.postgresql import JSONB


if TYPE_CHECKING:
    from .user_model import User
    from .comment_model import Comment  
    
class RecipeBlock(SQLModel):
    type: str
    value: Union[str, List[str]]


class RecipeBase(SQLModel):
    title: str
    description: str = ""
    thumbnail: Optional[str] = None
    recipe: List[RecipeBlock] = Field(default_factory=list, sa_column=Column(JSONB))


class RecipeCreate(RecipeBase):
    pass


class RecipeOut(RecipeBase):
    id: int
    created_at: datetime
    thumbnail: Optional[str] = None
    
    
class Recipe(RecipeBase, table=True):
    id: int = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")
    thumbnail: Optional[str] = Field(default=None, sa_column=Column(String, nullable=True))
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True),nullable=False,server_default=func.now()))
    
    author: "User" = Relationship(back_populates="recipes")
    comments: List["Comment"] = Relationship(back_populates="recipe")
