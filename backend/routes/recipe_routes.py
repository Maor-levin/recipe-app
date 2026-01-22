
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, or_
from db.models.user_model import User, PasswordConfirmation
from db.connection import get_session
from db.models.recipe_model import Recipe, RecipeCreate, RecipeOut, RecipeUpdate
from auth.auth_utils import get_current_user, verify_password
from services.ai_service import generate_recipe_variant
from pydantic import BaseModel
from typing import List


class VariantRequest(BaseModel):
    adjustments: List[str]


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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.get('/by-user/{user_id}', response_model=list[RecipeOut])
def get_recipes_by_user(user_id: int, db: Session = Depends(get_session)):
    user = db.get(User, user_id)
    if not user:
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if user owns this recipe
    if recipe.author_id != current_user.id:
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if user owns this recipe
    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only delete your own recipes"
        )
    
    # Verify password before deletion
    if not verify_password(password_data.password, current_user.hashed_password):
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
    Generate an AI-powered recipe variant
    
    - Takes a recipe and applies adjustments (vegan, gluten-free, etc.)
    - Returns modified recipe without saving to database
    """
    
    # Get the recipe
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Validate adjustments
    if not variant_request.adjustments or len(variant_request.adjustments) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one adjustment is required"
        )
    
    # Prepare recipe data for AI
    recipe_data = {
        'title': recipe.title,
        'description': recipe.description,
        'recipe': recipe.recipe
    }
    
    try:
        # Generate variant using AI
        result = await generate_recipe_variant(
            recipe_data,
            variant_request.adjustments
        )
        
        return {
            "original_recipe_id": recipe_id,
            "adjustments": variant_request.adjustments,
            "modified_title": result['modified_title'],
            "modified_description": result['modified_description'],
            "modified_blocks": result['modified_blocks'],
            "changes_made": result['changes_made']
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate variant: {str(e)}"
        )
