from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User, UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.delete("/{user_id}")
def user_delete(user_id: int, db: Session = Depends(get_session)):
    user = db.get(User, user_id)
    if not user: 
        return {"detail" : "User not found"}
    
    db.delete(user)
    db.commit()
    return {"details" : "User Deleted"}

@router.get("/all_users",response_model=list[UserOut])
def get_all_users(db: Session = Depends(get_session)):
    users = db.exec(select(User)).all()
    return users