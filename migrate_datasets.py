import numpy as np
from App.db.database import SessionLocal, engine
from App.db.models import Base, DatasetDetail
from App.ml.dataset import DATASETS

Base.metadata.create_all(bind=engine)

def migrate():
    db = SessionLocal()
    try:
        # Полностью очищаем таблицу с химическими данными перед загрузкой новых
        db.query(DatasetDetail).delete()
        db.commit()

        for model_name, data in DATASETS.items():
            # Преобразуем данные в numpy массивы для удобной обработки
            conc_arr = np.array(data["concentration"], dtype=float)
            cond_arr = np.array(data["conductivity_meter"], dtype=float)
            refr_arr = np.array(data["refractometr"], dtype=float)

            # Вычисляем средние для каждого параметра, игнорируя NaN
            mean_conc = np.nanmean(conc_arr)
            mean_cond = np.nanmean(cond_arr)
            mean_refr = np.nanmean(refr_arr)

            points_count = 0
            for i in range(len(conc_arr)):
                conc = conc_arr[i] if not np.isnan(conc_arr[i]) else mean_conc
                cond = cond_arr[i] if not np.isnan(cond_arr[i]) else mean_cond
                refr = refr_arr[i] if not np.isnan(refr_arr[i]) else mean_refr

                detail = DatasetDetail(
                    model_name=model_name,
                    concentration=float(conc),
                    conductivity_meter=float(cond),
                    refractometr=float(refr)
                )
                db.add(detail)
                points_count += 1

            print(f"Inserted {points_count} points for model '{model_name}' with NaN values filled by means")
        db.commit()
        print("Dataset migration complete!")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()