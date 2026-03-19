module.exports = function registerClientesRoutes(app, connection) {
  // Lista todos os clientes cadastrados.
  app.get("/clientes", async (req, res) => {
    const [resultado] = await connection.execute("SELECT * FROM clientes");
    return res.json(resultado);
  });

  // Busca clientes pelo nome exato informado na URL.
  app.get("/clientes/nome/:nome", async (req, res) => {
    const nome = req.params.nome;

    const [resultado] = await connection.execute(
      "SELECT * FROM clientes WHERE nome = ? ",
      [nome]
    );
    return res.json(resultado);
  });

  // Cria um novo cliente.
  app.post("/criar-cliente", async (req, res) => {
    const { nome, documento, email, telefone, endereco, cidade, estado, cep } =
      req.body;

    if (!nome) {
      return res.status(400).json({ error: "nome e obrigatorio" });
    }

    const [resultado] = await connection.execute(
      "INSERT INTO clientes (nome,documento,email,telefone,endereco,cidade,estado,cep) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [
        nome,
        documento ?? null,
        email ?? null,
        telefone ?? null,
        endereco ?? null,
        cidade ?? null,
        estado ?? null,
        cep ?? null,
      ]
    );

    return res.status(201).json({ id: resultado.insertId });
  });

  // Atualiza os dados de um cliente pelo ID.
  app.put("/clientes/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, documento, email, telefone, endereco, cidade, estado, cep } =
      req.body;

    if (!id || !nome) {
      return res.status(400).json({ error: "id e nome sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "UPDATE clientes SET nome = ?, documento = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, cep = ? WHERE id = ?",
      [
        nome,
        documento ?? null,
        email ?? null,
        telefone ?? null,
        endereco ?? null,
        cidade ?? null,
        estado ?? null,
        cep ?? null,
        id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "cliente nao encontrado" });
    }

    return res.json({ updated: resultado.affectedRows });
  });

  // Deleta um cliente pelo ID.
  app.delete("/clientes/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id e obrigatorio" });
    }

    const [resultado] = await connection.execute(
      "DELETE FROM clientes WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "cliente nao encontrado" });
    }

    return res.json({ deleted: resultado.affectedRows });
  });
};
