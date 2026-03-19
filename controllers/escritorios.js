module.exports = function registerEscritoriosRoutes(app, connection) {
  // Lista todos os escritorios cadastrados.
  app.get("/escritorios", async (req, res) => {
    const [resultado] = await connection.execute("SELECT * FROM escritorios");
    return res.json(resultado);
  });

  // Busca escritorios pelo email exato informado na URL.
  app.get("/escritorios/email/:email", async (req, res) => {
    const email = req.params.email;

    const [resultado] = await connection.execute(
      "SELECT * FROM escritorios WHERE email = ? ",
      [email]
    );
    return res.json(resultado);
  });

  // Busca escritorios pelo telefone exato informado na URL.
  app.get("/escritorios/telefone/:telefone", async (req, res) => {
    const telefone = req.params.telefone;
    console.log("estou aqui");
    const [resultado] = await connection.execute(
      "SELECT * FROM escritorios WHERE telefone = ? ",
      [telefone]
    );
    console.log(resultado);
    return res.json(resultado);
  });

  // Cria um novo escritorio.
  app.post("/criar-escritorio", async (req, res) => {
    const { nome, cnpj, email, telefone, endereco, cidade, estado, cep } =
      req.body;

    if (!nome || !cnpj) {
      return res.status(400).json({ error: "nome e cnpj sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "INSERT INTO escritorios (nome,cnpj,email,telefone,endereco,cidade,estado,cep) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
      [
        nome,
        cnpj,
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

  // Atualiza os dados de um escritorio pelo ID.
  app.put("/escritorios/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, email, telefone, endereco, cidade, estado, cep } =
      req.body;

    if (!id || !nome || !cnpj) {
      return res.status(400).json({ error: "id, nome e cnpj sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "UPDATE escritorios SET nome = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, cidade = ?, estado = ?, cep = ? WHERE id = ?",
      [
        nome,
        cnpj,
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
      return res.status(404).json({ error: "escritorio nao encontrado" });
    }

    return res.json({ updated: resultado.affectedRows });
  });

   app.delete("/escritorios/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id e obrigatorio" });
    }

    const [resultado] = await connection.execute(
      "DELETE FROM escritorios WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "escritorio nao encontrado" });
    }

    return res.json({ deleted: resultado.affectedRows });
  });
};


