import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Configurazione centralizzata dell'applicazione.
    I valori vengono letti dalle variabili d'ambiente o dal file .env.
    """

    # Metadati progetto
    PROJECT_NAME: str = "Progetto ITS Backend"
    VERSION: str = "0.1.0"

    # Prefisso API
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/progetto_its"

    # CORS - origini separate da virgola
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        """Converte la stringa CORS_ORIGINS in una lista di origini."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # Carica dal file .env nella root del backend
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
