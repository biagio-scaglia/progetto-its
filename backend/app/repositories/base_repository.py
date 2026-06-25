from typing import TypeVar, Type, List, Optional, Generic
from sqlalchemy.orm import Session
from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """
    Classe base che fornisce le operazioni CRUD elementari
    per qualsiasi modello ORM ereditato da Base.
    """

    def __init__(self, model: Type[ModelType], db: Session):
        self.model = model
        self.db = db

    def get_by_id(self, entity_id: int) -> Optional[ModelType]:
        """Recupera una singola entita' tramite il suo ID primario."""
        return self.db.query(self.model).filter(self.model.id == entity_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Recupera un elenco paginato di entita'."""
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def create(self, obj_data: dict) -> ModelType:
        """Crea e persiste una nuova entita' nel database."""
        db_obj = self.model(**obj_data)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def update(self, entity_id: int, obj_data: dict) -> Optional[ModelType]:
        """Aggiorna i campi di un'entita' esistente (solo valori non nulli)."""
        db_obj = self.get_by_id(entity_id)
        if db_obj is None:
            return None

        for field, value in obj_data.items():
            if value is not None:
                setattr(db_obj, field, value)

        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj

    def delete(self, entity_id: int) -> bool:
        """Elimina un'entita' dal database. Ritorna True se trovata e rimossa."""
        db_obj = self.get_by_id(entity_id)
        if db_obj is None:
            return False

        self.db.delete(db_obj)
        self.db.commit()
        return True
