# Sistema de Cadastro e Painel de Indicadores de Entregas

Sistema composto por 4 serviços conteinerizados via Docker Compose.

## Arquitetura e Tecnologias

- **Banco de Dados**: PostgreSQL 16
- **Backend**: FastAPI (Python 3.11) + SQLAlchemy + Pydantic
- **Frontend de Entrada**: Angular 18 (Formulário Reativo com validações e feedback)
- **Frontend de Consulta**: React 18 + Tailwind CSS (Painel de Indicadores, Gráficos e Tabela)
- **Orquestração**: Docker Compose

## Como Executar

Com o Docker e Docker Compose instalados, execute na raiz do projeto:

```bash
docker compose up --build
```

## Acesso aos Serviços

- **Frontend de Entrada (Angular)**: [http://localhost:4200](http://localhost:4200)
- **Frontend de Consulta (React + Tailwind)**: [http://localhost:3000](http://localhost:3000)
- **Backend API REST (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **Documentação OpenAPI (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Banco de Dados PostgreSQL**: `localhost:5432`

## Endpoints da API

- `POST /records`: Cadastra um novo registro de entrega (valida campos e rejeita números negativos)
- `GET /records`: Lista os registros ordenados por data decrescente
- `GET /summary`: Retorna dados consolidados (totais, médias e entregas por departamento)
- `GET /employees`: Lista os funcionários cadastrados