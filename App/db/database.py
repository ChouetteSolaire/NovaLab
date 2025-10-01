from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

# PostgreSQL (локально для разработки)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nova_lab_db")

# Создаём engine (добавь echo=True для отладки, если ошибки с SQL)
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)  # echo=True для логов SQL-запросов в консоль (полезно при ошибках)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()