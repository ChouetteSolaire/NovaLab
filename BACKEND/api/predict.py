from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from BACKEND.db.database import get_db
from BACKEND.core.auth import get_current_user
from BACKEND.db.models import User, PredictionHistory
from BACKEND.db.schemas import PredictionRequest, PredictionResponse
from BACKEND.ml.model_service import predict_concentration
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("", response_model=PredictionResponse)
def predict_endpoint(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Вызываем функцию предсказания с передачей сессии БД
        result = predict_concentration(
            model_name=request.model_name,
            conductivity_meter=request.conductivity_meter,
            refractometr=request.refractometr,
            db=db
        )
        # Сохраняем в историю предсказаний
        new_prediction = PredictionHistory(
            user_id=current_user.id,
            model_name=request.model_name,
            conductivity_meter=request.conductivity_meter,
            refractometr=request.refractometr,
            predicted_concentration=result
        )
        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        # Возвращаем ответ с результатом предсказания
        return PredictionResponse(
            model=request.model_name,
            predicted_concentration=result,
            # Можно добавить quality_score, если считаешь нужным
        )

    except Exception as e:
        logger.error(f"Ошибка при предсказании для модели {request.model_name}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )