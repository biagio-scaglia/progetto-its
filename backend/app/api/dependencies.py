from typing import Generator
from app.db.session import SessionLocal

def get_db() -> Generator:
    """
    Dependency che inizializza la sessione di database per ciascuna richiesta
    e garantisce la chiusura automatica al termine.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
