import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from loguru import logger
from core.config import settings
from auth.auth_utils import get_current_user
from typing import Optional

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

router = APIRouter(prefix="/api/upload", tags=["upload"])


# Allowed image types
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload an image to Cloudinary
    
    - Validates file type and size
    - Uploads to Cloudinary
    - Returns the secure URL
    """
    
    # Validate file type
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        logger.warning(f"Invalid file type attempted: {file.content_type}")
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Allowed types: JPEG, PNG, GIF, WebP"
        )
    
    # Read file content to check size
    contents = await file.read()
    file_size = len(contents)
    
    if file_size > MAX_FILE_SIZE:
        logger.warning(f"File too large: {file_size} bytes")
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 5MB"
        )
    
    # Reset file pointer for upload
    await file.seek(0)
    
    # Upload to Cloudinary
    # Use user_id in folder structure for organization
    # Let global exception handler catch any unexpected errors
    result = cloudinary.uploader.upload(
        contents,
        folder=f"recipe-app/users/{current_user.id}",
        resource_type="image",
        quality="auto",  # Automatic quality optimization
        fetch_format="auto"  # Automatic format selection (WebP when supported)
    )
    
    logger.info(f"Image uploaded successfully for user {current_user.id}", public_id=result["public_id"])
    
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
        "width": result["width"],
        "height": result["height"],
        "format": result["format"],
        "bytes": result["bytes"]
    }


@router.delete("/image/{public_id:path}")
async def delete_image(
    public_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an image from Cloudinary
    
    - Only allows users to delete their own images
    - public_id should be the Cloudinary public_id (including folder path)
    """
    
    # Verify the image belongs to the user (check folder path)
    user_folder = f"recipe-app/users/{current_user.id}"
    if not public_id.startswith(user_folder):
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own images"
        )
    
    # Delete from Cloudinary
    # Let global exception handler catch any unexpected errors
    result = cloudinary.uploader.destroy(public_id)
    
    # Check the result after successful API call
    if result.get("result") == "ok":
        return {"message": "Image deleted successfully"}
    else:
        raise HTTPException(
            status_code=404,
            detail="Image not found or already deleted"
        )


def delete_user_folder(user_id: int) -> bool:
    """
    Helper function to delete all images in a user's Cloudinary folder
    
    Returns True if successful, False otherwise
    """
    user_folder = f"recipe-app/users/{user_id}"
    try:
        # Delete all resources in the folder
        cloudinary.api.delete_resources_by_prefix(user_folder)
        # Delete the folder itself
        cloudinary.api.delete_folder(user_folder)
        return True
    except Exception as e:
        logger.warning(f"Failed to delete Cloudinary folder for user {user_id}: {e}")
        return False
