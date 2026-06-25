from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.case import Case
from app.repositories.base_repository import BaseRepository


class CaseRepository(BaseRepository[Case]):
    """Repository per le operazioni specifiche sulla tabella cases."""

    def __init__(self, db: Session):
        super().__init__(Case, db)

    def get_by_id_with_relations(self, case_id: int) -> Optional[Case]:
        """Recupera un caso con documenti, scadenze e note pre-caricati."""
        return (
            self.db.query(Case)
            .options(
                joinedload(Case.documents),
                joinedload(Case.deadlines),
                joinedload(Case.notes),
            )
            .filter(Case.id == case_id)
            .first()
        )

    def get_by_stato(self, stato: str, skip: int = 0, limit: int = 100) -> List[Case]:
        """Filtra i casi per stato."""
        return (
            self.db.query(Case)
            .filter(Case.stato == stato)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def search(self, query: str, skip: int = 0, limit: int = 100) -> List[Case]:
        """Ricerca testuale su titolo e descrizione del caso."""
        pattern = f"%{query}%"
        return (
            self.db.query(Case)
            .filter(
                (Case.titolo.ilike(pattern)) | (Case.descrizione.ilike(pattern))
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
