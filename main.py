from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from App.api import login, register, me, predict, history, datasets, lablog

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login.router, prefix="/login")
app.include_router(register.router, prefix="/register")
app.include_router(me.router, prefix="/me")
app.include_router(predict.router, prefix="/predict")
app.include_router(history.router, prefix="/history")
app.include_router(datasets.router, prefix="/datasets")
app.include_router(lablog.router, prefix="/lablog", tags=["Лабораторный журнал!"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)