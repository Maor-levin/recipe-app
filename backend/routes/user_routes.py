from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from auth.auth_utils import hash_password
from db.connection import get_session
from db.models.user_model import UserCreate, User, UserOut

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_session)):
    db_user = db.exec(select(User).where(User.email == user.email)).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password, user_name=user.user_name, first_name=user.first_name, last_name=user.last_name, country=user.country)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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