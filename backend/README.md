# Backend - Progetto ITS

Backend gestionale per pratiche, documenti, scadenze e note.

## Stack

- Python 3.11+
- FastAPI
- PostgreSQL
- SQLAlchemy 2.x
- Alembic (migrazioni)
- Pydantic v2 (validazione)
- slowapi (rate-limiting)

## Struttura

```
backend/
  app/
    api/
      routes/         # Router FastAPI per ogni risorsa
      dependencies.py # Dependency injection (db session)
    core/
      config.py       # Settings da variabili d'ambiente
    db/
      session.py      # Engine e SessionLocal SQLAlchemy
    models/           # Modelli ORM (Case, Document, Deadline, Note)
    schemas/          # Schemi Pydantic per validazione I/O
    repositories/     # Accesso dati (query SQL)
    services/         # Logica di business
    main.py           # Entry-point FastAPI
  migrations/         # Migrazioni Alembic
  tests/              # Test pytest
  requirements.txt
  alembic.ini
  .env / .env.example
```

## Setup

### 1. Ambiente virtuale

```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

### 2. Database PostgreSQL

Crea il database:

```sql
CREATE DATABASE progetto_its;
```

### 3. Configurazione

Copia `.env.example` in `.env` e modifica i valori:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/progetto_its
CORS_ORIGINS=http://localhost:5173
```

### 4. Migrazioni

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

### 5. Avvio

```bash
uvicorn app.main:app --reload --port 8000
```

L'API e' disponibile su `http://localhost:8000`.
La documentazione interattiva su `http://localhost:8000/docs`.

## Test

```bash
pytest tests/ -v
```

## Endpoint principali

| Metodo | Percorso | Descrizione |
|--------|----------|-------------|
| GET | /health | Health check |
| GET | /api/v1/cases/ | Lista casi (filtro: ?status=, ?q=) |
| POST | /api/v1/cases/ | Crea caso |
| GET | /api/v1/cases/{id} | Dettaglio caso con relazioni |
| PUT | /api/v1/cases/{id} | Aggiorna caso |
| DELETE | /api/v1/cases/{id} | Elimina caso |
| GET | /api/v1/cases/{id}/documents | Documenti del caso |
| POST | /api/v1/cases/{id}/documents | Crea documento |
| GET | /api/v1/cases/{id}/deadlines | Scadenze del caso |
| POST | /api/v1/cases/{id}/deadlines | Crea scadenza |
| GET | /api/v1/cases/deadlines/upcoming | Scadenze imminenti |
| GET | /api/v1/cases/deadlines/overdue | Scadenze scadute |
| GET | /api/v1/cases/{id}/notes | Note del caso |
| POST | /api/v1/cases/{id}/notes | Crea nota |
