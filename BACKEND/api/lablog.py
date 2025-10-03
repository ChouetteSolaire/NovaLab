from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from BACKEND.db.database import get_db
from BACKEND.core.auth import get_current_user
from BACKEND.db.models import LabLogEntry, User
from BACKEND.db.schemas import LabLogEntryCreate, LabLogEntryUpdate, LabLogEntryRead
from typing import List

router = APIRouter()

@router.get("", response_model=List[LabLogEntryRead])
def list_entries(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entries = db.query(LabLogEntry).filter(LabLogEntry.user_id == current_user.id).order_by(LabLogEntry.date.desc()).all()
    return entries

@router.post("", response_model=LabLogEntryRead, status_code=status.HTTP_201_CREATED)
def create_entry(entry_in: LabLogEntryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = LabLogEntry(**entry_in.dict(), user_id=current_user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.put("/{entry_id}", response_model=LabLogEntryRead)
def update_entry(entry_id: int, entry_in: LabLogEntryUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(LabLogEntry).filter(LabLogEntry.id == entry_id, LabLogEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    for key, value in entry_in.dict(exclude_unset=True).items():
        setattr(entry, key, value)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(entry_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    entry = db.query(LabLogEntry).filter(LabLogEntry.id == entry_id, LabLogEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Запись не найдена")
    db.delete(entry)
    db.commit()
    return None