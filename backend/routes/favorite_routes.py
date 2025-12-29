from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User
from db.models.recipe_model import Recipe
from db.models.favorite_model import Favorite, FavoriteOut
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.get("/my-favorites", response_model=list[dict])
def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all recipes favorited by current user"""
    query = (
        select(Favorite, Recipe)
        .join(Recipe, Favorite.recipe_id == Recipe.id)
        .where(Favorite.user_id == current_user.id)
        .order_by(Favorite.created_at.desc())
    )
    results = db.exec(query).all()
    
    favorites = []
    for favorite, recipe in results:
        # Load author relationship
        db.refresh(recipe, ["author"])
        favorites.append({
            "id": recipe.id,
            "title": recipe.title,
            "description": recipe.description,
            "thumbnail_image_url": recipe.thumbnail_image_url,
            "author_id": recipe.author_id,
            "created_at": recipe.created_at,
            "updated_at": recipe.updated_at,
            "author": {"user_name": recipe.author.user_name} if recipe.author else None,
            "favorited_at": favorite.created_at
        })
    
    return favorites


@router.post("/recipe/{recipe_id}", status_code=status.HTTP_201_CREATED)
def add_to_favorites(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Add a recipe to favorites"""
    # Check if recipe exists
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    # Check if already favorited
    existing = db.exec(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.recipe_id == recipe_id
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Recipe already in favorites"
        )
    
    # Create favorite
    favorite = Favorite(user_id=current_user.id, recipe_id=recipe_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return {"detail": "Added to favorites", "favorite_id": favorite.id}


@router.delete("/recipe/{recipe_id}")
def remove_from_favorites(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Remove a recipe from favorites"""
    favorite = db.exec(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.recipe_id == recipe_id
        )
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return {"detail": "Removed from favorites"}


@router.get("/check/{recipe_id}")
def check_if_favorited(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Check if a recipe is favorited by current user"""
    favorite = db.exec(
        select(Favorite).where(
            Favorite.user_id == current_user.id,
            Favorite.recipe_id == recipe_id
        )
    ).first()
    
    return {"is_favorited": favorite is not None}

