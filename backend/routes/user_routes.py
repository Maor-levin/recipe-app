from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from loguru import logger
from db.connection import get_session
from db.models.user_model import User, UserOut, PasswordConfirmation
from auth.auth_utils import get_current_user, verify_password
from routes.upload_routes import delete_user_folder

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile information"""
    return current_user


@router.delete("/me")
def delete_my_account(
    password_data: PasswordConfirmation,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete current user's account (requires password confirmation)"""
    # Verify password before deletion
    if not verify_password(password_data.password, current_user.hashed_password):
        logger.warning(f"User {current_user.id} provided incorrect password for account deletion")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )
    
    # Delete user's Cloudinary folder (all uploaded images)
    delete_user_folder(current_user.id)
    
    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted"}

