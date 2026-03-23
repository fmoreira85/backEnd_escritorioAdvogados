USE escritorio_advogados;

INSERT INTO escritorios (id, nome, cnpj, email, telefone, endereco, cidade, estado, cep)
VALUES
  (1, 'Almeida & Souza Advogados', '12.345.678/0001-90', 'contato@almeidasouza.com.br', '(11) 4000-1000', 'Rua das Flores, 120', 'Sao Paulo', 'SP', '01000-000'),
  (2, 'Costa Lima Associados', '98.765.432/0001-10', 'contato@costalima.com.br', '(21) 3000-2000', 'Av. Atlantica, 455', 'Rio de Janeiro', 'RJ', '22000-000'),
  (3, 'Silva Ribeiro Legal', '45.111.222/0001-55', 'contato@silvaribeiro.com.br', '(31) 3500-3000', 'Rua da Serra, 900', 'Belo Horizonte', 'MG', '30000-000');

INSERT INTO advogados (id, escritorio_id, nome, oab, especialidade, email, telefone, ativo)
VALUES
  (1, 1, 'Mariana Almeida', 'OAB/SP 123456', 'Trabalhista', 'mariana.almeida@almeidasouza.com.br', '(11) 99999-1001', 1),
  (2, 1, 'Pedro Souza', 'OAB/SP 654321', 'Civil', 'pedro.souza@almeidasouza.com.br', '(11) 99999-1002', 1),
  (3, 2, 'Renata Costa', 'OAB/RJ 222333', 'Familia', 'renata.costa@costalima.com.br', '(21) 98888-2001', 1),
  (4, 2, 'Lucas Lima', 'OAB/RJ 333222', 'Consumidor', 'lucas.lima@costalima.com.br', '(21) 98888-2002', 1),
  (5, 3, 'Ana Silva', 'OAB/MG 777888', 'Tributario', 'ana.silva@silvaribeiro.com.br', '(31) 97777-3001', 1);

INSERT INTO clientes (id, nome, documento, email, telefone, endereco, cidade, estado, cep)
VALUES
  (1, 'Joao Pereira', '123.456.789-00', 'joao.pereira@email.com', '(11) 98888-1111', 'Rua A, 10', 'Sao Paulo', 'SP', '01100-000'),
  (2, 'Carla Menezes', '987.654.321-00', 'carla.menezes@email.com', '(21) 97777-2222', 'Rua B, 20', 'Rio de Janeiro', 'RJ', '22200-000'),
  (3, 'Bruno Rocha', '111.222.333-44', 'bruno.rocha@email.com', '(31) 96666-3333', 'Rua C, 30', 'Belo Horizonte', 'MG', '30100-000'),
  (4, 'Empresa Nova Era LTDA', '12.345.678/0001-11', 'contato@novaera.com.br', '(11) 95555-4444', 'Av. Central, 100', 'Sao Paulo', 'SP', '01200-000');

INSERT INTO processos (id, escritorio_id, advogado_id, cliente_id, numero, titulo, status, data_abertura, data_encerramento, descricao)
VALUES
  (1, 1, 1, 1, '1000001-11.2026.8.26.0100', 'Reclamacao trabalhista - horas extras', 'andamento', '2026-01-10', NULL, 'Acao trabalhista por horas extras e adicional noturno.'),
  (2, 1, 2, 4, '1000002-22.2026.8.26.0100', 'Cobrança contratual', 'aberto', '2026-02-05', NULL, 'Cobranca de valores previstos em contrato de prestacao de servicos.'),
  (3, 2, 3, 2, '2000001-33.2026.8.19.0001', 'Divorcio consensual', 'andamento', '2026-02-20', NULL, 'Processo de divorcio consensual com partilha.'),
  (4, 2, 4, 2, '2000002-44.2026.8.19.0001', 'Indenizacao por dano moral', 'aberto', '2026-03-01', NULL, 'Alegacao de dano moral em relacao de consumo.'),
  (5, 3, 5, 3, '3000001-55.2026.8.13.0001', 'Defesa tributaria', 'aberto', '2026-01-25', NULL, 'Defesa em auto de infracao fiscal.');
