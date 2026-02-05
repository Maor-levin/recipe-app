from typing import List

from sqlmodel import Session, select

from db.models.recipe_model import Recipe, RecipeBlock
from db.models.recipe_variant_model import RecipeVariant
from services.ai_service import generate_recipe_variant


def normalize_adjustments(adjustments: List[str]) -> List[str]:
    """
    Normalize adjustments for consistent caching.

    - Lowercase
    - Strip whitespace
    - Sort alphabetically
    """
    cleaned = [a.strip().lower() for a in adjustments if a and a.strip()]
    # Remove duplicates while preserving determinism
    return sorted(set(cleaned))


async def get_or_create_variant(
    db: Session,
    recipe: Recipe,
    adjustments: List[str],
) -> RecipeVariant:
    """
    Get a cached variant for a recipe + adjustments, or generate and cache it.
    """
    normalized = normalize_adjustments(adjustments)
    if not normalized:
        raise ValueError("At least one valid adjustment is required")

    query = (
        select(RecipeVariant)
        .where(RecipeVariant.original_recipe_id == recipe.id)
        .where(RecipeVariant.adjustments_normalized == normalized)
    )
    
    # Check if the variant already exists
    variant = db.exec(query).first()
    if variant:
        return variant

    # Generate a new variant using AI
    recipe_data = {
        "title": recipe.title,
        "description": recipe.description,
        "recipe": recipe.recipe,
    }

    result = await generate_recipe_variant(
        recipe_data=recipe_data,
        adjustments=adjustments,
    )

    # 3) Persist the new variant
    variant = RecipeVariant(
        original_recipe_id=recipe.id,
        adjustments_normalized=normalized,
        modified_title=result["modified_title"],
        modified_description=result["modified_description"],
        modified_blocks=result["modified_blocks"],  # type: ignore[arg-type]
        changes_made=result.get("changes_made", []),
    )

    db.add(variant)
    db.commit()
    db.refresh(variant)

    return variant

