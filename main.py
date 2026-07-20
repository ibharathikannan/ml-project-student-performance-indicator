from pathlib import Path

from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from src.pipeline.predict_pipeline import CustomData, PredictPipeline

app = FastAPI(title="Student Exam Performance Indicator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")


class PredictionRequest(BaseModel):
    gender: str
    race_ethnicity: str
    parental_level_of_education: str
    lunch: str
    test_preparation_course: str
    reading_score: float = Field(ge=0, le=100)
    writing_score: float = Field(ge=0, le=100)


class PredictionResponse(BaseModel):
    prediction: float


@api_router.get("/health")
def health() -> dict:
    return {"status": "ok"}


@api_router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest) -> PredictionResponse:
    data = CustomData(
        gender=payload.gender,
        race_ethnicity=payload.race_ethnicity,
        parental_level_of_education=payload.parental_level_of_education,
        lunch=payload.lunch,
        test_preparation_course=payload.test_preparation_course,
        reading_score=payload.reading_score,
        writing_score=payload.writing_score,
    )
    pred_df = data.get_data_as_data_frame()

    pipeline = PredictPipeline()
    result = pipeline.predict(pred_df)

    return PredictionResponse(prediction=float(result[0]))


app.include_router(api_router)

# Serve the built Angular app (present in the Docker image; absent in local dev
# unless `npm run build` has been run into ../frontend/dist).
STATIC_DIR = Path(__file__).parent / "static"
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5000)
