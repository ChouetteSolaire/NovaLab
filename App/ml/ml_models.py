import joblib
import os
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBRegressor
from App.ml.dataset import DATASETS

MODEL_DIR = 'models/'


def train_model(name: str):
    data = DATASETS[name]
    df = pd.DataFrame(data)  # Добавь эту строку!
    df['conductivity_meter'] = pd.to_numeric(df['conductivity_meter'], errors='coerce')
    df['refractometr'] = df['refractometr'].fillna(df['refractometr'].mean())
    X = df[['conductivity_meter', 'refractometr']]
    y = df['concentration']
    model = XGBRegressor(n_estimators=1000, learning_rate=0.01)
    model.fit(X, y)
    return model


def load_model(name: str):
    model_path = os.path.join(MODEL_DIR, f'{name}.joblib')
    if not os.path.exists(model_path):
        return train_model(name)
    return joblib.load(model_path)


# Кэш моделей
MODELS = {}