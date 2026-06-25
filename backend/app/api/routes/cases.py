from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.services.case_service import CaseService
from app.schemas.case import CaseResponse, CaseCreate, CaseUpdate, CaseAggregatedResponse
from app.schemas.document import DocumentResponse, DocumentCreate, DocumentUpdate
from app.schemas.deadline import DeadlineResponse, DeadlineCreate, DeadlineUpdate
from app.schemas.note import NoteResponse, NoteCreate, NoteUpdate

router = APIRouter()


def _get_service(db: Session = Depends(get_db)) -> CaseService:
    return CaseService(db)


# ======================================================================
# Casi
# ======================================================================

@router.get("/", response_model=List[CaseResponse])
def list_cases(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    stato: Optional[str] = None,
    q: Optional[str] = None,
    service: CaseService = Depends(_get_service),
):
    """Elenco paginato dei casi, con filtro opzionale per stato o ricerca testuale."""
    if q:
        return service.search_cases(q, skip=skip, limit=limit)
    if stato:
        return service.filter_cases_by_stato(stato, skip=skip, limit=limit)
    return service.list_cases(skip=skip, limit=limit)


@router.post("/", response_model=CaseResponse, status_code=201)
def create_case(
    data: CaseCreate,
    service: CaseService = Depends(_get_service),
):
    """Crea un nuovo caso."""
    return service.create_case(data)


@router.get("/{case_id}", response_model=CaseAggregatedResponse)
def get_case(
    case_id: int,
    service: CaseService = Depends(_get_service),
):
    """Recupera un singolo caso con documenti, scadenze e note associati."""
    case = service.get_case(case_id)
    if case is None:
        raise HTTPException(status_code=404, detail="Caso non trovato")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: int,
    data: CaseUpdate,
    service: CaseService = Depends(_get_service),
):
    """Aggiorna un caso esistente."""
    case = service.update_case(case_id, data)
    if case is None:
        raise HTTPException(status_code=404, detail="Caso non trovato")
    return case


@router.delete("/{case_id}", status_code=204)
def delete_case(
    case_id: int,
    service: CaseService = Depends(_get_service),
):
    """Elimina un caso."""
    if not service.delete_case(case_id):
        raise HTTPException(status_code=404, detail="Caso non trovato")


# ======================================================================
# Documenti (sotto-risorsa di un caso)
# ======================================================================

@router.get("/{case_id}/documents", response_model=List[DocumentResponse])
def list_documents(
    case_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: CaseService = Depends(_get_service),
):
    return service.list_documents(case_id, skip=skip, limit=limit)


@router.post("/{case_id}/documents", response_model=DocumentResponse, status_code=201)
def create_document(
    case_id: int,
    data: DocumentCreate,
    service: CaseService = Depends(_get_service),
):
    return service.create_document(case_id, data)


@router.put("/documents/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    data: DocumentUpdate,
    service: CaseService = Depends(_get_service),
):
    doc = service.update_document(document_id, data)
    if doc is None:
        raise HTTPException(status_code=404, detail="Documento non trovato")
    return doc


@router.delete("/documents/{document_id}", status_code=204)
def delete_document(
    document_id: int,
    service: CaseService = Depends(_get_service),
):
    if not service.delete_document(document_id):
        raise HTTPException(status_code=404, detail="Documento non trovato")


# ======================================================================
# Scadenze (sotto-risorsa di un caso)
# ======================================================================

@router.get("/deadlines/upcoming", response_model=List[DeadlineResponse])
def list_upcoming_deadlines(
    days: int = Query(30, ge=1, le=365),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: CaseService = Depends(_get_service),
):
    """Scadenze non completate nei prossimi N giorni (cross-caso)."""
    return service.get_upcoming_deadlines(days=days, skip=skip, limit=limit)


@router.get("/deadlines/overdue", response_model=List[DeadlineResponse])
def list_overdue_deadlines(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: CaseService = Depends(_get_service),
):
    """Scadenze gia' passate e non completate (cross-caso)."""
    return service.get_overdue_deadlines(skip=skip, limit=limit)


@router.get("/{case_id}/deadlines", response_model=List[DeadlineResponse])
def list_deadlines(
    case_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: CaseService = Depends(_get_service),
):
    return service.list_deadlines(case_id, skip=skip, limit=limit)


@router.post("/{case_id}/deadlines", response_model=DeadlineResponse, status_code=201)
def create_deadline(
    case_id: int,
    data: DeadlineCreate,
    service: CaseService = Depends(_get_service),
):
    return service.create_deadline(case_id, data)


@router.put("/deadlines/{deadline_id}", response_model=DeadlineResponse)
def update_deadline(
    deadline_id: int,
    data: DeadlineUpdate,
    service: CaseService = Depends(_get_service),
):
    dl = service.update_deadline(deadline_id, data)
    if dl is None:
        raise HTTPException(status_code=404, detail="Scadenza non trovata")
    return dl


@router.delete("/deadlines/{deadline_id}", status_code=204)
def delete_deadline(
    deadline_id: int,
    service: CaseService = Depends(_get_service),
):
    if not service.delete_deadline(deadline_id):
        raise HTTPException(status_code=404, detail="Scadenza non trovata")


# ======================================================================
# Note (sotto-risorsa di un caso)
# ======================================================================

@router.get("/{case_id}/notes", response_model=List[NoteResponse])
def list_notes(
    case_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: CaseService = Depends(_get_service),
):
    return service.list_notes(case_id, skip=skip, limit=limit)


@router.post("/{case_id}/notes", response_model=NoteResponse, status_code=201)
def create_note(
    case_id: int,
    data: NoteCreate,
    service: CaseService = Depends(_get_service),
):
    return service.create_note(case_id, data)


@router.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    data: NoteUpdate,
    service: CaseService = Depends(_get_service),
):
    note = service.update_note(note_id, data)
    if note is None:
        raise HTTPException(status_code=404, detail="Nota non trovata")
    return note


@router.delete("/notes/{note_id}", status_code=204)
def delete_note(
    note_id: int,
    service: CaseService = Depends(_get_service),
):
    if not service.delete_note(note_id):
        raise HTTPException(status_code=404, detail="Nota non trovata")
