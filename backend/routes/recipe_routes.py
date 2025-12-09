
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.models.user_model import User
from db.connection import get_session
from db.models.recipe_model import Recipe, RecipeCreate, RecipeOut
from auth.auth_utils import get_current_user


router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get('/all', response_model=list[RecipeOut])
def get_all_recipes(db: Session=Depends(get_session)):
    query = select(Recipe)
    recipes = db.exec(query).all()
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


@router.get('/{recipeId}', response_model=RecipeOut)
def get_recipe_by_id(recipeId: int, db: Session=Depends(get_session)):
    recipe = db.get(Recipe, recipeId)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.get('/by-user/{userId}', response_model=list[RecipeOut])
def get_recipes_by_user(userId: int, db: Session=Depends(get_session)):
    user  = db.get(User, userId)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    query = select(Recipe).where(Recipe.author_id == userId)
    recipes = db.exec(query).all()
    return recipes
    
@router.delete('/{recipeId}')
def delete_recipe(
    recipeId: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    recipe = db.get(Recipe, recipeId)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if user owns this recipe
    if recipe.author_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You can only delete your own recipes"
        )
    
    db.delete(recipe)
    db.commit()
    return {"detail": "Recipe deleted"}
