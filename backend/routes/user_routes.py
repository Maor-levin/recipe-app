from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User, UserOut
from auth.auth_utils import get_current_user, verify_password
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])


class DeleteAccountRequest(BaseModel):
    password: str


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile information"""
    return current_user


@router.delete("/me")
def delete_my_account(
    password_data: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete current user's account (requires password confirmation)"""
    # Verify password before deletion
    if not verify_password(password_data.password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted"}

