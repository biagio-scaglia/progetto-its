from typing import List
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.models.deadline import Deadline
from app.repositories.base_repository import BaseRepository


class DeadlineRepository(BaseRepository[Deadline]):
    """Repository per le operazioni specifiche sulla tabella deadlines."""

    def __init__(self, db: Session):
        super().__init__(Deadline, db)

    def get_by_case_id(self, case_id: int, skip: int = 0, limit: int = 100) -> List[Deadline]:
        """Recupera tutte le scadenze di un caso specifico."""
        return (
            self.db.query(Deadline)
            .filter(Deadline.case_id == case_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_upcoming(self, days: int = 30, skip: int = 0, limit: int = 100) -> List[Deadline]:
        """Restituisce le scadenze non completate nei prossimi N giorni."""
        today = date.today()
        end_date = today + timedelta(days=days)
        return (
            self.db.query(Deadline)
            .filter(
                Deadline.data_scadenza >= today,
                Deadline.data_scadenza <= end_date,
                Deadline.stato != "completata",
            )
            .order_by(Deadline.data_scadenza.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_overdue(self, skip: int = 0, limit: int = 100) -> List[Deadline]:
        """Restituisce le scadenze non completate gia' scadute."""
        today = date.today()
        return (
            self.db.query(Deadline)
            .filter(
                Deadline.data_scadenza < today,
                Deadline.stato != "completata",
            )
            .order_by(Deadline.data_scadenza.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )
