from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from App.db.database import get_db
from App.core.auth import get_current_user
from App.db.models import User, PredictionHistory
from App.db.schemas import PredictionHistoryResponse, PredictionHistoryItem

router = APIRouter()

@router.get("", response_model=PredictionHistoryResponse)
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history_orm = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .order_by(PredictionHistory.timestamp.desc())
        .all()
    )
    history = [PredictionHistoryItem.from_orm(item).dict() for item in history_orm]
    return PredictionHistoryResponse(history=history)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted_count = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id).delete()
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)