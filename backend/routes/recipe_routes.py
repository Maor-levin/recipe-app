
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.models.user_model import User
from db.connection import get_session
from db.models.recipe_model import Recipe, RecipeCreate, RecipeOut, RecipeUpdate
from auth.auth_utils import get_current_user


router = APIRouter(prefix="/recipes", tags=["recipes"])

@router.get('/all', response_model=list[RecipeOut])
def get_all_recipes(db: Session = Depends(get_session)):
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
    
    db.delete(recipe)
    db.commit()
    return {"detail": "Recipe deleted"}
