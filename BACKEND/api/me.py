from fastapi import Depends, APIRouter
from BACKEND.db.models import User
from BACKEND.db.schemas import UserRead
from BACKEND.core.auth import get_current_user

router = APIRouter()

@router.get("", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user