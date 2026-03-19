CREATE DATABASE IF NOT EXISTS escritorio_advogados
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE escritorio_advogados;

CREATE TABLE IF NOT EXISTS escritorios (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  cnpj VARCHAR(32) NULL,
  email VARCHAR(180) NULL,
  telefone VARCHAR(40) NULL,
  endereco VARCHAR(200) NULL,
  cidade VARCHAR(100) NULL,
  estado VARCHAR(80) NULL,
  cep VARCHAR(20) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_escritorios_cnpj (cnpj),
  KEY idx_escritorios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS advogados (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  escritorio_id BIGINT UNSIGNED NOT NULL,
  nome VARCHAR(160) NOT NULL,
  oab VARCHAR(40) NOT NULL,
  especialidade VARCHAR(120) NULL,
  email VARCHAR(180) NULL,
  telefone VARCHAR(40) NULL,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_advogados_oab (oab),
  KEY idx_advogados_escritorio (escritorio_id),
  KEY idx_advogados_email (email),
  CONSTRAINT fk_advogados_escritorio
    FOREIGN KEY (escritorio_id) REFERENCES escritorios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(160) NOT NULL,
  documento VARCHAR(40) NULL,
  email VARCHAR(180) NULL,
  telefone VARCHAR(40) NULL,
  endereco VARCHAR(200) NULL,
  cidade VARCHAR(100) NULL,
  estado VARCHAR(80) NULL,
  cep VARCHAR(20) NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_clientes_documento (documento),
  KEY idx_clientes_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS processos (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  escritorio_id BIGINT UNSIGNED NOT NULL,
  advogado_id BIGINT UNSIGNED NOT NULL,
  cliente_id BIGINT UNSIGNED NOT NULL,
  numero VARCHAR(60) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  status ENUM('aberto','andamento','encerrado','arquivado') NOT NULL DEFAULT 'aberto',
  data_abertura DATE NOT NULL DEFAULT (CURRENT_DATE),
  data_encerramento DATE NULL,
  descricao TEXT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_processos_numero (numero),
  KEY idx_processos_escritorio (escritorio_id),
  KEY idx_processos_advogado (advogado_id),
  KEY idx_processos_cliente (cliente_id),
  CONSTRAINT fk_processos_escritorio
    FOREIGN KEY (escritorio_id) REFERENCES escritorios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_processos_advogado
    FOREIGN KEY (advogado_id) REFERENCES advogados(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_processos_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
