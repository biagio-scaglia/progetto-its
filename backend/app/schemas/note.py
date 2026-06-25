import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class NoteBase(BaseModel):
    contenuto: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    contenuto: Optional[str] = None


class NoteResponse(NoteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    case_id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
