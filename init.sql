CREATE TABLE IF NOT EXISTS funcionarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registros (
    id SERIAL PRIMARY KEY,
    funcionario_id INTEGER NOT NULL REFERENCES funcionarios(id) ON DELETE CASCADE,
    data_referencia DATE NOT NULL,
    quantidade_entregas INTEGER NOT NULL CHECK (quantidade_entregas >= 0),
    observacao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_registros_data_referencia ON registros(data_referencia DESC);
CREATE INDEX IF NOT EXISTS idx_registros_funcionario_id ON registros(funcionario_id);

INSERT INTO funcionarios (nome, departamento) VALUES
    ('Carlos Eduardo', 'Logística'),
    ('Mariana Rocha', 'Operações'),
    ('João Pedro Costa', 'Expedição'),
    ('Beatriz Lima', 'Logística')
ON CONFLICT DO NOTHING;

INSERT INTO registros (funcionario_id, data_referencia, quantidade_entregas, observacao) VALUES
    (1, '2026-09-01', 18, 'Entregas do turno da manhã'),
    (2, '2026-09-01', 25, 'Entregas da rota central'),
    (3, '2026-08-31', 14, 'Entregas de grande porte'),
    (1, '2026-08-31', 20, 'Entregas no período vespertino')
ON CONFLICT DO NOTHING;
