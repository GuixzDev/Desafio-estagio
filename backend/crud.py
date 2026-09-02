from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas

def get_employees(db: Session):
    return db.query(models.Funcionario).order_by(models.Funcionario.nome).all()

def create_record(db: Session, record_in: schemas.RecordCreate):
    db_record = models.Registro(
        funcionario_id=record_in.funcionario_id,
        data_referencia=record_in.data_referencia,
        quantidade_entregas=record_in.quantidade_entregas,
        observacao=record_in.observacao,
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

def get_records(db: Session):
    records = (
        db.query(models.Registro)
        .join(models.Funcionario)
        .order_by(models.Registro.data_referencia.desc(), models.Registro.id.desc())
        .all()
    )
    result = []
    for r in records:
        result.append(
            schemas.RecordResponse(
                id=r.id,
                funcionario_id=r.funcionario_id,
                funcionario_nome=r.funcionario.nome,
                departamento=r.funcionario.departamento,
                data_referencia=r.data_referencia,
                quantidade_entregas=r.quantidade_entregas,
                observacao=r.observacao,
                criado_em=r.criado_em,
            )
        )
    return result

def get_summary(db: Session):
    total_registros = db.query(models.Registro).count()
    total_entregas = db.query(func.coalesce(func.sum(models.Registro.quantidade_entregas), 0)).scalar()
    media = round(float(total_entregas / total_registros), 2) if total_registros > 0 else 0.0

    dept_totals = (
        db.query(
            models.Funcionario.departamento,
            func.coalesce(func.sum(models.Registro.quantidade_entregas), 0).label("total_entregas"),
        )
        .join(models.Registro, models.Funcionario.id == models.Registro.funcionario_id)
        .group_by(models.Funcionario.departamento)
        .order_by(func.sum(models.Registro.quantidade_entregas).desc())
        .all()
    )

    por_departamento = [
        schemas.DepartmentSummary(departamento=row[0], total_entregas=int(row[1]))
        for row in dept_totals
    ]

    return schemas.SummaryResponse(
        total_registros=total_registros,
        total_entregas=int(total_entregas),
        media_entregas=media,
        por_departamento=por_departamento,
    )

