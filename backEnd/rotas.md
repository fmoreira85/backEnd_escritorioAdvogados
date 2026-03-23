# Guia de rotas - Thunder Client

Base URL:
`http://localhost:3000`

Header para requests com body JSON:
`Content-Type: application/json`

## Ordem sugerida de testes
1. Criar escritorio
2. Criar cliente
3. Criar advogado (precisa de `escritorio_id`)
4. Criar processo (precisa de `escritorio_id`, `advogado_id` e `cliente_id`)
5. Testar GET, PUT e DELETE

## Advogados

### GET /advogados
Lista todos os advogados.

### GET /advogados/nome/:nome
Busca advogado pelo nome exato.
Exemplo:
`GET /advogados/nome/Joao`

### POST /criar-advogado
Cria um advogado.
Body exemplo:
```json
{
  "escritorio_id": 1,
  "nome": "Joao Silva",
  "oab": "OAB123456",
  "especialidade": "Trabalhista",
  "email": "joao@exemplo.com",
  "telefone": "65999990000",
  "ativo": 1
}
```

### PUT /advogados/:id
Atualiza advogado por ID.
Exemplo de URL:
`PUT /advogados/1`
Body exemplo:
```json
{
  "escritorio_id": 1,
  "nome": "Joao Silva Atualizado",
  "oab": "OAB123456",
  "especialidade": "Civel",
  "email": "joao.atualizado@exemplo.com",
  "telefone": "65999991111",
  "ativo": 1
}
```

### DELETE /advogados/:id
Remove advogado por ID.
Exemplo:
`DELETE /advogados/1`

## Clientes

### GET /clientes
Lista todos os clientes.

### GET /clientes/nome/:nome
Busca cliente pelo nome exato.
Exemplo:
`GET /clientes/nome/Maria`

### POST /criar-cliente
Cria um cliente.
Body exemplo:
```json
{
  "nome": "Maria Souza",
  "documento": "12345678900",
  "email": "maria@exemplo.com",
  "telefone": "65988887777",
  "endereco": "Rua A, 100",
  "cidade": "Cuiaba",
  "estado": "MT",
  "cep": "78000000"
}
```

### PUT /clientes/:id
Atualiza cliente por ID.
Exemplo de URL:
`PUT /clientes/1`
Body exemplo:
```json
{
  "nome": "Maria Souza Atualizada",
  "documento": "12345678900",
  "email": "maria.atualizada@exemplo.com",
  "telefone": "65988886666",
  "endereco": "Rua B, 200",
  "cidade": "Cuiaba",
  "estado": "MT",
  "cep": "78000001"
}
```

### DELETE /clientes/:id
Remove cliente por ID.
Exemplo:
`DELETE /clientes/1`

## Escritorios

### GET /escritorios
Lista todos os escritorios.

### GET /escritorios/email/:email
Busca escritorio por email exato.
Exemplo:
`GET /escritorios/email/contato@escritorio.com`

### GET /escritorios/telefone/:telefone
Busca escritorio por telefone exato.
Exemplo:
`GET /escritorios/telefone/65999990000`

### POST /criar-escritorio
Cria um escritorio.
Body exemplo:
```json
{
  "nome": "Escritorio Alpha",
  "cnpj": "12345678000199",
  "email": "contato@alpha.com",
  "telefone": "65999990000",
  "endereco": "Av Principal, 500",
  "cidade": "Cuiaba",
  "estado": "MT",
  "cep": "78000010"
}
```

### PUT /escritorios/:id
Atualiza escritorio por ID.
Exemplo de URL:
`PUT /escritorios/1`
Body exemplo:
```json
{
  "nome": "Escritorio Alpha Atualizado",
  "cnpj": "12345678000199",
  "email": "contato@alpha.com",
  "telefone": "65999994444",
  "endereco": "Av Principal, 700",
  "cidade": "Cuiaba",
  "estado": "MT",
  "cep": "78000011"
}
```

### DELETE /escritorios/:id
Remove escritorio por ID.
Exemplo:
`DELETE /escritorios/1`

## Processos

### GET /processos
Lista todos os processos.

### POST /criar-processo
Cria um processo.
Body exemplo:
```json
{
  "escritorio_id": 1,
  "advogado_id": 1,
  "cliente_id": 1,
  "numero": "0001234-56.2026.8.11.0001",
  "titulo": "Acao de Cobranca",
  "status": "andamento",
  "descricao": "Processo de cobranca inicial"
}
```

Observacao de `status`:
Use apenas valores aceitos no banco: `aberto`, `andamento`, `encerrado`, `arquivado`.

### PUT /processos/:id
Atualiza processo por ID.
Exemplo de URL:
`PUT /processos/1`
Body exemplo:
```json
{
  "escritorio_id": 1,
  "advogado_id": 1,
  "cliente_id": 1,
  "numero": "0001234-56.2026.8.11.0001",
  "titulo": "Acao de Cobranca Atualizada",
  "status": "encerrado",
  "descricao": "Processo encerrado"
}
```

### DELETE /processos/:id
Remove processo por ID.
Exemplo:
`DELETE /processos/1`
