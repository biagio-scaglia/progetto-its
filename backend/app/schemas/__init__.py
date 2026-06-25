from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate, CaseAggregatedResponse
from app.schemas.document import DocumentCreate, DocumentResponse, DocumentUpdate
from app.schemas.deadline import DeadlineCreate, DeadlineResponse, DeadlineUpdate
from app.schemas.note import NoteCreate, NoteResponse, NoteUpdate

__all__ = [
    "CaseCreate", "CaseResponse", "CaseUpdate", "CaseAggregatedResponse",
    "DocumentCreate", "DocumentResponse", "DocumentUpdate",
    "DeadlineCreate", "DeadlineResponse", "DeadlineUpdate",
    "NoteCreate", "NoteResponse", "NoteUpdate",
]
