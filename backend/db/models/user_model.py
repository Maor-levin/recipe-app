from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from pydantic import EmailStr
from sqlmodel import Column, DateTime, Relationship, SQLModel, Field, String, func

if TYPE_CHECKING:
    from .recipe_model import Recipe

class UserBase(SQLModel):
    user_name: str = Field(sa_column=Column(String(50), unique=True))
    first_name: str
    last_name: str 
    email: EmailStr = Field(sa_column=Column(String(255), unique=True))
    country: Optional[str] = None 
    

class UserCreate(UserBase):
    password: str = Field(repr=False)
  
    
class UserOut(UserBase): 
    id: int
    
    class Config:
        from_attributes = True
    
    
class User(UserBase, table=True): 
    created_at: datetime = Field(sa_column=Column(DateTime(timezone=True),nullable=False,server_default=func.now()))
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str = Field(repr=False)
    
    recipes: List["Recipe"] = Relationship(back_populates="author")