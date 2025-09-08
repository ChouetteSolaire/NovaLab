from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PredictionRequest(BaseModel):
    model_name: str
    conductivity_meter: float
    refractometr: float

class PredictionResponse(BaseModel):
    model: str
    predicted_concentration: float


class PredictionHistoryItem(BaseModel):
    id: int
    model_name: str
    conductivity_meter: float
    refractometr: float
    predicted_concentration: float
    timestamp: datetime

    class Config:
        from_attributes = True


class PredictionHistoryResponse(BaseModel):
    history: List[PredictionHistoryItem]