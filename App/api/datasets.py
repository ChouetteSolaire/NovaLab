from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from App.db.database import get_db
from App.db.models import DatasetDetail
from sklearn.linear_model import LinearRegression
import numpy as np

router = APIRouter()

@router.get("/{model_name}")
def get_dataset(model_name: str, db: Session = Depends(get_db)):
    results = db.query(DatasetDetail).filter(DatasetDetail.model_name == model_name).all()
    if not results:
        raise HTTPException(status_code=404, detail="Model not found")
    return [
        {
            "concentration": r.concentration,
            "conductivity_meter": r.conductivity_meter,
            "refractometr": r.refractometr
        }
        for r in results
    ]


@router.post("/{model_name}/quality")  # Для расчёта качества (используется в predict)
def calculate_quality(model_name: str, data: dict, db: Session = Depends(get_db)):
    # Получаем все записи модели из базы
    results = db.query(DatasetDetail).filter(DatasetDetail.model_name == model_name).all()
    if not results:
        raise HTTPException(status_code=404, detail="Model not found")

    # Формируем списки данных, фильтруя NaN (если есть)
    concentration = []
    conductivity_meter = []
    refractometr = []
    for r in results:
        if (
            r.concentration is not None and
            r.conductivity_meter is not None and
            r.refractometr is not None
        ):
            concentration.append(r.concentration)
            conductivity_meter.append(r.conductivity_meter)
            refractometr.append(r.refractometr)

    if not concentration:
        return {"quality_score": 0.0, "predicted_concentration": 0.0}

    # Формируем массивы numpy
    X = np.array([[cm, r] for cm, r in zip(conductivity_meter, refractometr)])
    y = np.array(concentration)

    # Обучаем простую линейную регрессию
    model = LinearRegression().fit(X, y)

    user_point = np.array([[float(data["conductivity_meter"]), float(data["refractometr"])]])
    predicted = float(model.predict(user_point)[0])  # Предсказание концентрации

    distances = np.linalg.norm(X - user_point, axis=1)
    min_dist = np.min(distances) if len(distances) > 0 else 0
    avg_dist = np.mean(distances) if len(distances) > 0 else 1

    quality = float(100 - (min_dist / avg_dist * 100)) if avg_dist > 0 else 100

    return {
        "quality_score": round(max(0, min(100, quality)), 2),
        "predicted_concentration": round(predicted, 4)
    }