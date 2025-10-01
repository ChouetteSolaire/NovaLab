from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

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
    quality_score: float | None = None

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

class LabLogEntryBase(BaseModel):
    date: Optional[datetime]
    solution_name: str
    volume_ml: float
    notes: Optional[str] = ""

class LabLogEntryCreate(LabLogEntryBase):
    pass

class LabLogEntryUpdate(LabLogEntryBase):
    pass

class LabLogEntryRead(LabLogEntryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True