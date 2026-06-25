import datetime
from typing import List
from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Case(Base):
    """
    Rappresenta un caso di assistenza o gestione pratiche del cittadino.
    """
    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    codice: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    titolo: Mapped[str] = mapped_column(String(255), nullable=False)
    descrizione: Mapped[str] = mapped_column(Text, nullable=True)
    stato: Mapped[str] = mapped_column(String(50), default="aperto", nullable=False)
    
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    # Relazioni a cascata (se si cancella un caso, si cancellano i dati associati)
    documents: Mapped[List["Document"]] = relationship(
        back_populates="case", cascade="all, delete-orphan"
    )
    deadlines: Mapped[List["Deadline"]] = relationship(
        back_populates="case", cascade="all, delete-orphan"
    )
    notes: Mapped[List["Note"]] = relationship(
        back_populates="case", cascade="all, delete-orphan"
    )
