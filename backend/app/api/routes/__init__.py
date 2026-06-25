from fastapi import APIRouter
from app.api.routes import cases

api_router = APIRouter()
api_router.include_router(cases.router, prefix="/cases", tags=["cases"])
