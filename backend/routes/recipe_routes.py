
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, field_validator
from sqlmodel import Session, or_, select
from loguru import logger

from auth.auth_utils import get_current_user, verify_password
from db.connection import get_session
from db.models.recipe_model import Recipe, RecipeCreate, RecipeOut, RecipeUpdate
from db.models.user_model import PasswordConfirmation, User
from services.variant_cache_service import get_or_create_variant
from typing import List


class VariantRequest(BaseModel):
    adjustments: List[str]
    
    @field_validator('adjustments')
    @classmethod
    def validate_adjustments(cls, v: List[str]) -> List[str]:
        if not v or len(v) == 0:
            raise ValueError("At least one adjustment is required")
        return v


router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get('/', response_model=list[RecipeOut])
def get_recipes(q: str = "", db: Session = Depends(get_session)):
    """
    Get all recipes or search with a query
    - If query (q) is empty: returns all recipes
    - If query provided: searches by title, description, or author username
    """
    
    # Empty query - return all recipes
    if not q or not q.strip():
        query = select(Recipe)
        recipes = db.exec(query).all()
    
    # Search query provided - filter recipes
    else:
        search_term = f"%{q.lower()}%"
        
        # Join Recipe with User (author) and search across multiple fields
        query = (
            select(Recipe)
            .join(User, Recipe.author_id == User.id)
            .where(
                or_(
                    Recipe.title.ilike(search_term),
                    Recipe.description.ilike(search_term),
                    User.user_name.ilike(search_term)
                )
            )
        )
        
        recipes = db.exec(query).all()
    
    # Load author relationship for each recipe
    for recipe in recipes:
        db.refresh(recipe, ["author"])
    
    return recipes

@router.post('/', response_model=RecipeOut, status_code=status.HTTP_201_CREATED)
def create_new_recipe(
    recipe: RecipeCreate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    new_recipe = Recipe(**recipe.model_dump(), author_id=current_user.id)
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    return new_recipe


@router.get('/{recipe_id}', response_model=RecipeOut)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_session)):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        logger.debug(f"Recipe {recipe_id} not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.get('/by-user/{user_id}', response_model=list[RecipeOut])
def get_recipes_by_user(user_id: int, db: Session = Depends(get_session)):
    user = db.get(User, user_id)
    if not user:
        logger.debug(f"User {user_id} not found")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    query = select(Recipe).where(Recipe.author_id == user_id)
    recipes = db.exec(query).all()
    return recipes
    
@router.put('/{recipe_id}', response_model=RecipeOut)
def update_recipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        logger.debug(f"Recipe {recipe_id} not found for update")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if user owns this recipe
    if recipe.author_id != current_user.id:
        logger.warning(
            f"User {current_user.id} attempted to edit recipe {recipe_id} owned by {recipe.author_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only edit your own recipes"
        )
    
    # Update only provided fields
    update_data = recipe_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(recipe, field, value)
    
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


@router.delete('/{recipe_id}')
def delete_recipe(
    recipe_id: int,
    password_data: PasswordConfirmation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        logger.debug(f"Recipe {recipe_id} not found for deletion")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if user owns this recipe
    if recipe.author_id != current_user.id:
        logger.warning(
            f"User {current_user.id} attempted to delete recipe {recipe_id} owned by {recipe.author_id}"
        )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only delete your own recipes"
        )
    
    # Verify password before deletion
    if not verify_password(password_data.password, current_user.hashed_password):
        logger.warning(f"User {current_user.id} provided incorrect password for recipe deletion")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    db.delete(recipe)
    db.commit()
    return {"detail": "Recipe deleted"}


@router.post('/{recipe_id}/variants')
async def generate_variant(
    recipe_id: int,
    variant_request: VariantRequest,
    db: Session = Depends(get_session)
):
    """
    Generate or retrieve a cached AI-powered recipe variant.

    - Takes a recipe and applies adjustments (vegan, gluten-free, etc.)
    - First checks database for an existing variant with the same adjustments
    - If not found, calls the AI service, caches the result, and returns it
    """
    # Get the recipe
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        logger.debug(f"Recipe {recipe_id} not found for variant generation")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Use cache-aside service to get or create variant
    # Pydantic validator ensures adjustments is not empty
    variant = await get_or_create_variant(
        db=db,
        recipe=recipe,
        adjustments=variant_request.adjustments,
    )

    logger.info(
        f"Variant generated for recipe {recipe_id}",
        adjustments=variant_request.adjustments,
    )

    return {
        "original_recipe_id": recipe_id,
        "adjustments": variant_request.adjustments,
        "modified_title": variant.modified_title,
        "modified_description": variant.modified_description,
        "modified_blocks": variant.modified_blocks,
        "changes_made": variant.changes_made,
    }
