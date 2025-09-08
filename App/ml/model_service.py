from App.ml.ml_models import load_model
import numpy as np
import logging

logger = logging.getLogger(__name__)

def predict_concentration(model_name: str, conductivity_meter: float, refractometr: float) -> float:
    try:
        model = load_model(model_name)
        input_features = np.array([[conductivity_meter, refractometr]])
        prediction = model.predict(input_features)[0]
        logger.info(f"Prediction for {model_name}: conductivity={conductivity_meter}, refractometr={refractometr} -> concentration={prediction}")
        return float(prediction)
    except Exception as e:
        logger.error(f"Prediction error for {model_name}: {str(e)}")
        raise ValueError(f"Prediction failed: {str(e)}")