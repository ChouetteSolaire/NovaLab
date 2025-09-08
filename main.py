from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from App.db.database import Base, engine
from App.api import login, register, me, predict, history
import logging

app = FastAPI()

origins = [
    "http://localhost:3000",  # старый порт
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # новый порт для Vite
    "http://127.0.0.1:5173",  # если frontend на этом адресе
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # разрешённые источники
    allow_credentials=True,
    allow_methods=["*"],    # разрешаем все методы
    allow_headers=["*"],    # разрешаем все заголовки
)

app.include_router(login.router, prefix="/login")
app.include_router(register.router, prefix="/register")
app.include_router(me.router, prefix="/me")
app.include_router(predict.router, prefix="/predict")
app.include_router(history.router, prefix="/history")

Base.metadata.create_all(bind=engine)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Вывод в консоль
        logging.FileHandler('app.log', encoding='utf-8')  # Сохранение в файл app.log
    ]
)

if __name__ == "__main__":
    import uvicorn
    logging.info("Приложение FastAPI запущено")
    uvicorn.run(app, host="127.0.0.1", port=8000)