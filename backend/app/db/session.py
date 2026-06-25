from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Inizializzazione del motore del database
engine = create_engine(
    settings.DATABASE_URL,
    # pool_pre_ping assicura il ripristino automatico delle connessioni interrotte
    pool_pre_ping=True
)

# Fabbrica per le sessioni locali dei thread/richieste
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
