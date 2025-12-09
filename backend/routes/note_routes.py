from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db.connection import get_session
from db.models.user_model import User
from db.models.recipe_model import Recipe
from db.models.note_model import Note, NoteCreate, NoteOut
from auth.auth_utils import get_current_user

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/recipe/{recipe_id}", response_model=NoteOut | None)
def get_my_note_for_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get my personal note for a specific recipe"""
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    query = select(Note).where(
        Note.recipe_id == recipe_id,
        Note.user_id == current_user.id
    )
    note = db.exec(query).first()
    
    if not note:
        return None
    
    return NoteOut(
        id=note.id,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at,
        recipe_id=note.recipe_id
    )


@router.put("/recipe/{recipe_id}", response_model=NoteOut)
def create_or_update_note(
    recipe_id: int,
    note_data: NoteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Create or update my personal note for a recipe"""
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    
    # Check if note already exists
    query = select(Note).where(
        Note.recipe_id == recipe_id,
        Note.user_id == current_user.id
    )
    existing_note = db.exec(query).first()
    
    if existing_note:
        # Update existing note
        existing_note.content = note_data.content
        db.add(existing_note)
        db.commit()
        db.refresh(existing_note)
        note = existing_note
    else:
        # Create new note
        note = Note(
            content=note_data.content,
            user_id=current_user.id,
            recipe_id=recipe_id
        )
        db.add(note)
        db.commit()
        db.refresh(note)
    
    return NoteOut(
        id=note.id,
        content=note.content,
        created_at=note.created_at,
        updated_at=note.updated_at,
        recipe_id=note.recipe_id
    )


@router.delete("/recipe/{recipe_id}")
def delete_my_note(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete my personal note for a recipe"""
    query = select(Note).where(
        Note.recipe_id == recipe_id,
        Note.user_id == current_user.id
    )
    note = db.exec(query).first()
    
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"detail": "Note deleted"}


@router.get("/my-notes", response_model=list[NoteOut])
def get_all_my_notes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all my personal notes across all recipes"""
    query = select(Note).where(Note.user_id == current_user.id)
    notes = db.exec(query).all()
    
    return [
        NoteOut(
            id=note.id,
            content=note.content,
            created_at=note.created_at,
            updated_at=note.updated_at,
            recipe_id=note.recipe_id
        )
        for note in notes
    ]

