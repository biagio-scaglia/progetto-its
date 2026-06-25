import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DocumentBase(BaseModel):
    nome: str = Field(..., max_length=255)
    tipo: str = Field(..., max_length=50)
    dimensione: str = Field(..., max_length=50)
    stato: str = Field("in_attesa", max_length=50)


class DocumentCreate(DocumentBase):
    pass


class DocumentUpdate(BaseModel):
    nome: Optional[str] = Field(None, max_length=255)
    tipo: Optional[str] = Field(None, max_length=50)
    dimensione: Optional[str] = Field(None, max_length=50)
    stato: Optional[str] = Field(None, max_length=50)


class DocumentResponse(DocumentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    case_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
