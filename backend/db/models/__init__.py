"""
Database models module.

This module imports all SQLModel table classes to ensure they're registered
with SQLModel.metadata before database table creation.
"""

# Import all table models to register them with SQLModel.metadata
from .user_model import User
from .recipe_model import Recipe
from .comment_model import Comment
from .note_model import Note
from .favorite_model import Favorite
from .recipe_variant_model import RecipeVariant

__all__ = [
    "User",
    "Recipe",
    "Comment",
    "Note",
    "Favorite",
    "RecipeVariant",
]
