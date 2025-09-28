from App.ml.ml_models import load_model, train_model, MODELS
from App.db.database import get_db
from App.db.dataset_service import get_dataset_df
import numpy as np
import logging
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


def predict_concentration(
        model_name: str,
        conductivity_meter: float,
        refractometr: float,
        db: Session
) -> float:
    """
    Загружает модель, обучает её на данных из БД (если ещё нет), делает предсказание.
    """
    try:
        # Пытаемся загрузить модель из кэша
        if model_name not in MODELS:
            try:
                model = load_model(model_name)
                MODELS[model_name] = model
            except FileNotFoundError:
                # Если модели нет, то загружаем данные из БД и тренируем
                df = get_dataset_df(db, model_name)
                model = train_model(model_name, df)
                MODELS[model_name] = model

        model = MODELS[model_name]
        input_features = np.array([[conductivity_meter, refractometr]])
        prediction = model.predict(input_features)[0]
        logger.info(
            f"Prediction for {model_name}: conductivity={conductivity_meter}, refractometr={refractometr} -> concentration={prediction}"
        )
        return float(prediction)
    except Exception as e:
        logger.error(f"Prediction error for {model_name}: {str(e)}")
        raise ValueError(f"Prediction failed: {str(e)}")