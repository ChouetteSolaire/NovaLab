from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from BACKEND.db.models import User
from BACKEND.db.schemas import UserCreate, UserRead
from BACKEND.core.security import hash_password
from BACKEND.db.database import get_db

router = APIRouter()

@router.post("", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Имя пользователя занято")
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user