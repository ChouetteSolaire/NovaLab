from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from App.db.database import get_db
from App.core.auth import get_current_user
from App.db.models import User, PredictionHistory
from App.db.schemas import PredictionHistoryResponse, PredictionHistoryItem
import logging

router = APIRouter()

@router.get("", response_model=PredictionHistoryResponse)
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    history_orm = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .order_by(PredictionHistory.timestamp.desc())
        .all()
    )
    logging.info(f'Число предсказаний в истории: {len(history_orm)}')
    for item in history_orm:
        logging.info(f'Item: id={item.id}, timestamp={item.timestamp}, concentration={item.predicted_concentration}')
    history = [PredictionHistoryItem.from_orm(item).dict() for item in history_orm]
    return PredictionHistoryResponse(history=history)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted_count = db.query(PredictionHistory).filter(PredictionHistory.user_id == current_user.id).delete()
    db.commit()
    logging.info(f'Удалено записей истории: {deleted_count}')
    return Response(status_code=status.HTTP_204_NO_CONTENT)