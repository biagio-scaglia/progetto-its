import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class DeadlineBase(BaseModel):
    titolo: str = Field(..., max_length=255)
    descrizione: Optional[str] = None
    data_scadenza: datetime.date
    priorita: str = Field("media", max_length=50)
    stato: str = Field("in_attesa", max_length=50)


class DeadlineCreate(DeadlineBase):
    pass


class DeadlineUpdate(BaseModel):
    titolo: Optional[str] = Field(None, max_length=255)
    descrizione: Optional[str] = None
    data_scadenza: Optional[datetime.date] = None
    priorita: Optional[str] = Field(None, max_length=50)
    stato: Optional[str] = Field(None, max_length=50)


class DeadlineResponse(DeadlineBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    case_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
