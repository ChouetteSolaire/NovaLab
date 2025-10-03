from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from BACKEND.db.database import get_db
from BACKEND.db.models import User
from BACKEND.db.schemas import UserLogin, Token
from BACKEND.core.security import verify_password
from BACKEND.core.auth import create_access_token

router = APIRouter()

@router.post("", response_model=Token)
def login(form_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}