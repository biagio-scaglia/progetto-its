import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime, Date, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Deadline(Base):
    """
    Rappresenta un adempimento o scadenza programmata per un caso.
    """
    __tablename__ = "deadlines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    titolo: Mapped[str] = mapped_column(String(255), nullable=False)
    descrizione: Mapped[str] = mapped_column(Text, nullable=True)
    data_scadenza: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    priorita: Mapped[str] = mapped_column(String(50), default="media", nullable=False) # es. "alta", "media", "bassa"
    stato: Mapped[str] = mapped_column(String(50), default="in_attesa", nullable=False) # es. "in_attesa", "completata", "scaduta"
    
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
    case: Mapped["Case"] = relationship(back_populates="deadlines")
