from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class Funcionario(Base):
    __tablename__ = "funcionarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(120), nullable=False)
    departamento = Column(String(100), nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    registros = relationship("Registro", back_populates="funcionario", cascade="all, delete-orphan")

class Registro(Base):
    __tablename__ = "registros"

    id = Column(Integer, primary_key=True, index=True)
    funcionario_id = Column(Integer, ForeignKey("funcionarios.id", ondelete="CASCADE"), nullable=False)
    data_referencia = Column(Date, nullable=False, index=True)
    quantidade_entregas = Column(Integer, nullable=False)
    observacao = Column(Text, nullable=True)
    criado_em = Column(DateTime, default=datetime.utcnow)

    funcionario = relationship("Funcionario", back_populates="registros")
