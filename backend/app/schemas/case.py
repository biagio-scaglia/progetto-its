import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.document import DocumentResponse
from app.schemas.deadline import DeadlineResponse
from app.schemas.note import NoteResponse


class CaseBase(BaseModel):
    titolo: str = Field(..., max_length=255)
    descrizione: Optional[str] = None
    stato: str = Field("aperto", max_length=50)


class CaseCreate(CaseBase):
    codice: Optional[str] = Field(None, max_length=50)


class CaseUpdate(BaseModel):
    titolo: Optional[str] = Field(None, max_length=255)
    descrizione: Optional[str] = None
    stato: Optional[str] = Field(None, max_length=50)


class CaseResponse(CaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codice: str
    created_at: datetime.datetime
    updated_at: datetime.datetime


class CaseAggregatedResponse(CaseResponse):
    """Risposta con tutti i dati aggregati del caso: documenti, scadenze e note."""
    documents: List[DocumentResponse] = []
    deadlines: List[DeadlineResponse] = []
    notes: List[NoteResponse] = []
