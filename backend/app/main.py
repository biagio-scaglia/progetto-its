from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.core.config import settings
from app.db.session import engine
from app.models.base import Base
from app.api.routes import api_router


# ---------------------------------------------------------------------------
# Rate-limiter globale
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


# ---------------------------------------------------------------------------
# Lifecycle
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creazione tabelle al primo avvio (in sviluppo).
    # In produzione usare esclusivamente Alembic.
    Base.metadata.create_all(bind=engine)
    yield


# ---------------------------------------------------------------------------
# Applicazione FastAPI
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend gestionale per pratiche, documenti, scadenze e note.",
    lifespan=lifespan,
)

# Rate-limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router API
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


# ---------------------------------------------------------------------------
# Health-check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "version": settings.VERSION}
