from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User
from db.models.recipe_model import Recipe
from db.models.comment_model import Comment, CommentCreate, CommentOut
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/comments", tags=["comments"])


@router.get("/recipe/{recipe_id}", response_model=list[CommentOut])
def get_comments_for_recipe(recipe_id: int, db: Session = Depends(get_session)):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    query = select(Comment).where(Comment.recipe_id == recipe_id)
    comments = db.exec(query).all()
    
    result = []
    for comment in comments:
        author = db.get(User, comment.user_id)
        result.append(CommentOut(
            id=comment.id,
            content=comment.content,
            created_at=comment.created_at,
            user_id=comment.user_id,
            recipe_id=comment.recipe_id,
            author_name=author.user_name if author else "Unknown"
        ))
    return result


@router.post("/recipe/{recipe_id}", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    recipe_id: int,
    comment: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    new_comment = Comment(
        content=comment.content,
        user_id=current_user.id,
        recipe_id=recipe_id
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return CommentOut(
        id=new_comment.id,
        content=new_comment.content,
        created_at=new_comment.created_at,
        user_id=new_comment.user_id,
        recipe_id=new_comment.recipe_id,
        author_name=current_user.user_name
    )


@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    comment = db.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own comments"
        )
    
    db.delete(comment)
    db.commit()
    return {"detail": "Comment deleted"}

