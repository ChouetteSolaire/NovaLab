import joblib
import os
import pandas as pd
from xgboost import XGBRegressor

MODEL_DIR = 'models/'

def train_model(name: str, df: pd.DataFrame) -> XGBRegressor:
    """
    Обучение модели на данных, переданных в DataFrame.
    """
    # Приводим к корректному типу и заполняем NaN средним по столбцу refractometr
    df['conductivity_meter'] = pd.to_numeric(df['conductivity_meter'], errors='coerce')
    df['refractometr'] = df['refractometr'].fillna(df['refractometr'].mean())

    X = df[['conductivity_meter', 'refractometr']]
    y = df['concentration']

    model = XGBRegressor(n_estimators=1000, learning_rate=0.01)
    model.fit(X, y)

    # Сохраняем обученную модель
    model_path = os.path.join(MODEL_DIR, f'{name}.joblib')
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, model_path)

    return model

def load_model(name: str) -> XGBRegressor:
    model_path = os.path.join(MODEL_DIR, f'{name}.joblib')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model '{name}' is not trained yet")
    return joblib.load(model_path)

# Кэш моделей
MODELS = {}