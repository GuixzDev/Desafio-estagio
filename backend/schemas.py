from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class FuncionarioResponse(BaseModel):
    id: int
    nome: str
    departamento: str

    class Config:
        from_attributes = True

class RecordCreate(BaseModel):
    funcionario_id: int
    data_referencia: date
    quantidade_entregas: int = Field(..., ge=0)
    observacao: Optional[str] = None

class RecordResponse(BaseModel):
    id: int
    funcionario_id: int
    funcionario_nome: str
    departamento: str
    data_referencia: date
    quantidade_entregas: int
    observacao: Optional[str] = None
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True

class DepartmentSummary(BaseModel):
    departamento: str
    total_entregas: int

class SummaryResponse(BaseModel):
    total_registros: int
    total_entregas: int
    media_entregas: float
    por_departamento: List[DepartmentSummary]
