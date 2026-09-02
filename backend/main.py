from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
import models
import schemas
import crud

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Registros de Entregas",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/employees", response_model=List[schemas.FuncionarioResponse])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)

@app.post("/records", response_model=schemas.RecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(record_in: schemas.RecordCreate, db: Session = Depends(get_db)):
    emp = db.query(models.Funcionario).filter(models.Funcionario.id == record_in.funcionario_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Funcionário não encontrado")
    
    created = crud.create_record(db, record_in)
    return schemas.RecordResponse(
        id=created.id,
        funcionario_id=created.funcionario_id,
        funcionario_nome=emp.nome,
        departamento=emp.departamento,
        data_referencia=created.data_referencia,
        quantidade_entregas=created.quantidade_entregas,
        observacao=created.observacao,
        criado_em=created.criado_em,
    )

@app.get("/records", response_model=List[schemas.RecordResponse])
def list_records(db: Session = Depends(get_db)):
    return crud.get_records(db)

@app.get("/summary", response_model=schemas.SummaryResponse)
def get_summary(db: Session = Depends(get_db)):
    return crud.get_summary(db)
