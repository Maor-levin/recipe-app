from datetime import datetime
from typing import List

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Column, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlmodel import Field, Relationship, SQLModel

from .recipe_model import Recipe, RecipeBlock


class RecipeVariantBase(SQLModel):
    """Base fields for a cached recipe variant."""

    adjustments_normalized: List[str] = Field(
        sa_column=Column(JSONB, nullable=False),
        description="Normalized adjustments (lowercased, sorted) used as cache key",
    )
    modified_title: str = Field(
        min_length=3,
        max_length=200,
        sa_column=Column(String(200), nullable=False),
    )
    modified_description: str = Field(
        default="",
        max_length=1000,
        sa_column=Column(String(1000), nullable=False),
    )
    modified_blocks: List[RecipeBlock] = Field(
        default_factory=list,
        sa_column=Column(JSONB, nullable=False),
    )
    changes_made: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSONB, nullable=False),
    )


class RecipeVariant(RecipeVariantBase, table=True):
    """Cached AI-generated variant of a recipe."""

    __tablename__ = "recipe_variant"
    __table_args__ = (
        UniqueConstraint(
            "original_recipe_id",
            "adjustments_normalized",
            name="uq_recipe_variant_recipe_adjustments",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)

    original_recipe_id: int = Field(
        sa_column=Column(
            ForeignKey("recipe.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

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

    original_recipe: Recipe = Relationship(back_populates="variants")

