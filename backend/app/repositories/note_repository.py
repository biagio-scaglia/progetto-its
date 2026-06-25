from typing import List
from sqlalchemy.orm import Session
from app.models.note import Note
from app.repositories.base_repository import BaseRepository


class NoteRepository(BaseRepository[Note]):
    """Repository per le operazioni specifiche sulla tabella notes."""

    def __init__(self, db: Session):
        super().__init__(Note, db)

    def get_by_case_id(self, case_id: int, skip: int = 0, limit: int = 100) -> List[Note]:
        """Recupera tutte le note di un caso specifico, ordinate per data."""
        return (
            self.db.query(Note)
            .filter(Note.case_id == case_id)
            .order_by(Note.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
