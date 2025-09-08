from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from App.db.database import get_db
from App.core.auth import get_current_user
from App.ml.model_service import predict_concentration
from App.db.models import User, PredictionHistory
from App.db.schemas import PredictionRequest, PredictionResponse

router = APIRouter()

@router.post("", response_model=PredictionResponse)
def predict_endpoint(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Получаем результат предсказания
    result = predict_concentration(request.model_name, request.conductivity_meter, request.refractometr)

    # Создаем запись в истории предсказаний
    new_prediction = PredictionHistory(
        user_id=current_user.id,
        model_name=request.model_name,
        conductivity_meter=request.conductivity_meter,
        refractometr=request.refractometr,
        predicted_concentration=result
    )

    # Сохраняем в базе
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return PredictionResponse(
        model=request.model_name,
        predicted_concentration=result
    )