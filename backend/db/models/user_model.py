from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from pydantic import EmailStr, field_validator
from sqlmodel import Column, DateTime, Relationship, SQLModel, Field, String, func

if TYPE_CHECKING:
    from .recipe_model import Recipe
    from .comment_model import Comment
    from .note_model import Note
    from .favorite_model import Favorite

class UserBase(SQLModel):
    user_name: str = Field(min_length=3, max_length=50, sa_column=Column(String(50), unique=True))
    first_name: str = Field(min_length=1, max_length=100, sa_column=Column(String(100)))
    last_name: str = Field(min_length=1, max_length=100, sa_column=Column(String(100)))
    email: EmailStr = Field(sa_column=Column(String(255), unique=True))
    country: Optional[str] = Field(None, max_length=100, sa_column=Column(String(100), nullable=True))
    
    @field_validator('user_name')
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Username cannot be empty or whitespace')
        if len(v.strip()) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username can only contain letters, numbers, hyphens, and underscores')
        return v.strip() 
    

class UserCreate(UserBase):
    password: str = Field(repr=False)
  
    
class UserOut(UserBase): 
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
    
    
class User(UserBase, table=True): 
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True),nullable=False,server_default=func.now()))
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field(repr=False)
    
    recipes: List["Recipe"] = Relationship(back_populates="author")
    comments: List["Comment"] = Relationship(back_populates="author")
    notes: List["Note"] = Relationship(back_populates="owner")
    favorites: List["Favorite"] = Relationship(back_populates="user")