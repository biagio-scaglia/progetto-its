from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.case import Case
from app.repositories.case_repository import CaseRepository
from app.repositories.document_repository import DocumentRepository
from app.repositories.deadline_repository import DeadlineRepository
from app.repositories.note_repository import NoteRepository
from app.schemas.case import CaseCreate, CaseUpdate
from app.schemas.document import DocumentCreate, DocumentUpdate
from app.schemas.deadline import DeadlineCreate, DeadlineUpdate
from app.schemas.note import NoteCreate, NoteUpdate


class CaseService:
    """
    Servizio che orchestra la logica di business relativa ai casi
    e alle entita' correlate (documenti, scadenze, note).
    """

    def __init__(self, db: Session):
        self.db = db
        self.case_repo = CaseRepository(db)
        self.document_repo = DocumentRepository(db)
        self.deadline_repo = DeadlineRepository(db)
        self.note_repo = NoteRepository(db)

    # ------------------------------------------------------------------
    # Casi
    # ------------------------------------------------------------------

    def get_case(self, case_id: int) -> Optional[Case]:
        return self.case_repo.get_by_id_with_relations(case_id)

    def list_cases(self, skip: int = 0, limit: int = 100) -> List[Case]:
        return self.case_repo.get_all(skip=skip, limit=limit)

    def search_cases(self, query: str, skip: int = 0, limit: int = 100) -> List[Case]:
        return self.case_repo.search(query, skip=skip, limit=limit)

    def filter_cases_by_stato(self, stato: str, skip: int = 0, limit: int = 100) -> List[Case]:
        return self.case_repo.get_by_stato(stato, skip=skip, limit=limit)

    def create_case(self, data: CaseCreate) -> Case:
        return self.case_repo.create(data.model_dump())

    def update_case(self, case_id: int, data: CaseUpdate) -> Optional[Case]:
        return self.case_repo.update(case_id, data.model_dump(exclude_unset=True))

    def delete_case(self, case_id: int) -> bool:
        return self.case_repo.delete(case_id)

    # ------------------------------------------------------------------
    # Documenti
    # ------------------------------------------------------------------

    def list_documents(self, case_id: int, skip: int = 0, limit: int = 100):
        return self.document_repo.get_by_case_id(case_id, skip=skip, limit=limit)

    def create_document(self, case_id: int, data: DocumentCreate):
        payload = data.model_dump()
        payload["case_id"] = case_id
        return self.document_repo.create(payload)

    def update_document(self, document_id: int, data: DocumentUpdate):
        return self.document_repo.update(document_id, data.model_dump(exclude_unset=True))

    def delete_document(self, document_id: int) -> bool:
        return self.document_repo.delete(document_id)

    # ------------------------------------------------------------------
    # Scadenze
    # ------------------------------------------------------------------

    def list_deadlines(self, case_id: int, skip: int = 0, limit: int = 100):
        return self.deadline_repo.get_by_case_id(case_id, skip=skip, limit=limit)

    def get_upcoming_deadlines(self, days: int = 30, skip: int = 0, limit: int = 100):
        return self.deadline_repo.get_upcoming(days=days, skip=skip, limit=limit)

    def get_overdue_deadlines(self, skip: int = 0, limit: int = 100):
        return self.deadline_repo.get_overdue(skip=skip, limit=limit)

    def create_deadline(self, case_id: int, data: DeadlineCreate):
        payload = data.model_dump()
        payload["case_id"] = case_id
        return self.deadline_repo.create(payload)

    def update_deadline(self, deadline_id: int, data: DeadlineUpdate):
        return self.deadline_repo.update(deadline_id, data.model_dump(exclude_unset=True))

    def delete_deadline(self, deadline_id: int) -> bool:
        return self.deadline_repo.delete(deadline_id)

    # ------------------------------------------------------------------
    # Note
    # ------------------------------------------------------------------

    def list_notes(self, case_id: int, skip: int = 0, limit: int = 100):
        return self.note_repo.get_by_case_id(case_id, skip=skip, limit=limit)

    def create_note(self, case_id: int, data: NoteCreate):
        payload = data.model_dump()
        payload["case_id"] = case_id
        return self.note_repo.create(payload)

    def update_note(self, note_id: int, data: NoteUpdate):
        return self.note_repo.update(note_id, data.model_dump(exclude_unset=True))

    def delete_note(self, note_id: int) -> bool:
        return self.note_repo.delete(note_id)
