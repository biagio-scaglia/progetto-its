from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Argomenti extra per la connessione (es. check_same_thread per SQLite)
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

# Inizializzazione del motore del database
engine = create_engine(
    settings.DATABASE_URL,
    # pool_pre_ping assicura il ripristino automatico delle connessioni interrotte
    pool_pre_ping=True,
    connect_args=connect_args
)

# Fabbrica per le sessioni locali dei thread/richieste
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
