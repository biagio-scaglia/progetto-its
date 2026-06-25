from typing import List
from sqlalchemy.orm import Session
from app.models.document import Document
from app.repositories.base_repository import BaseRepository


class DocumentRepository(BaseRepository[Document]):
    """Repository per le operazioni specifiche sulla tabella documents."""

    def __init__(self, db: Session):
        super().__init__(Document, db)

    def get_by_case_id(self, case_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        """Recupera tutti i documenti appartenenti a un caso specifico."""
        return (
            self.db.query(Document)
            .filter(Document.case_id == case_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_tipo(self, tipo: str, skip: int = 0, limit: int = 100) -> List[Document]:
        """Filtra documenti per tipologia."""
        return (
            self.db.query(Document)
            .filter(Document.tipo == tipo)
            .offset(skip)
            .limit(limit)
            .all()
        )
