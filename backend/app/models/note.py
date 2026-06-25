import datetime
from sqlalchemy import Text, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Note(Base):
    """
    Rappresenta una nota di commento o annotazione all'interno di un caso.
    """
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    contenuto: Mapped[str] = mapped_column(Text, nullable=False)
    
    case_id: Mapped[int] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    # Relazione inversa
    case: Mapped["Case"] = relationship(back_populates="notes")
