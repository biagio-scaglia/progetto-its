import datetime
from sqlalchemy import String, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Document(Base):
    """
    Rappresenta un documento associato a un caso specifico.
    """
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo: Mapped[str] = mapped_column(String(50), nullable=False) # es. "PDF", "PNG"
    dimensione: Mapped[str] = mapped_column(String(50), nullable=False) # es. "1.5 MB"
    stato: Mapped[str] = mapped_column(String(50), default="in_attesa", nullable=False) # es. "da_caricare", "caricato"
    
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
    case: Mapped["Case"] = relationship(back_populates="documents")
    
# Import tardivo necessario per evitare riferimenti circolari a runtime se necessario,
# ma usando i tipi tra virgolette stringa "Case" SQLAlchemy risolve a runtime in autonomia.
