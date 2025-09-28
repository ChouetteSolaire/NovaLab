from sqlalchemy.orm import Session
from App.db.models import DatasetDetail
import pandas as pd

def get_dataset_df(db: Session, model_name: str) -> pd.DataFrame:
    """
    Забирает данные из БД по модели и возвращает Pandas DataFrame
    """
    records = db.query(DatasetDetail).filter(DatasetDetail.model_name == model_name).all()
    if not records:
        raise ValueError(f"Dataset for model {model_name} not found in database")
    data = {
        "concentration": [r.concentration for r in records],
        "conductivity_meter": [r.conductivity_meter for r in records],
        "refractometr": [r.refractometr for r in records],
    }
    df = pd.DataFrame(data)
    return df