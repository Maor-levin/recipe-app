from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Column, DateTime, Field, Relationship, SQLModel, String, func

if TYPE_CHECKING:
    from .comment_model import Comment
    from .favorite_model import Favorite
    from .note_model import Note
    from .recipe_model import Recipe


class UserBase(SQLModel):
    user_name: str = Field(
        min_length=3,
        max_length=50,
        sa_column=Column(String(50), unique=True),
    )
    first_name: str = Field(
        min_length=1,
        max_length=100,
        sa_column=Column(String(100)),
    )
    last_name: str = Field(
        min_length=1,
        max_length=100,
        sa_column=Column(String(100)),
    )
    email: EmailStr = Field(
        sa_column=Column(String(255), unique=True),
    )
    country: Optional[str] = Field(
        default=None,
        max_length=100,
        sa_column=Column(String(100), nullable=True),
    )

    @field_validator("user_name")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Username cannot be empty or whitespace")
        if len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters long")
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError(
                "Username can only contain letters, numbers, hyphens, and underscores"
            )
        return v.strip()


class UserCreate(UserBase):
    password: str = Field(repr=False)


class PasswordConfirmation(BaseModel):
    password: str


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now(),
        )
    )
    hashed_password: str = Field(repr=False)

    recipes: List["Recipe"] = Relationship(
        back_populates="author",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    comments: List["Comment"] = Relationship(
        back_populates="author",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    notes: List["Note"] = Relationship(
        back_populates="owner",
        sa_relationship_kwargs={"passive_deletes": True},
    )
    favorites: List["Favorite"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"passive_deletes": True},
    )