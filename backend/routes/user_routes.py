from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User, UserOut
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.delete("/{user_id}")
def user_delete(
    user_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    # Users can only delete themselves
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own account"
        )
    
    db.delete(current_user)
    db.commit()
    return {"detail": "User deleted"}

@router.get("/all_users",response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_session)):
    users = db.exec(select(User)).all()
    return users