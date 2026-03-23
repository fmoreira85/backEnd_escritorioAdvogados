module.exports = function registerAdvogadosRoutes(app, connection) {
  // Lista todos os advogados cadastrados.
  app.get("/advogados", async (req, res) => {
    const [resultado] = await connection.execute("SELECT * FROM advogados");
    return res.json(resultado);
  });

  // Cria um novo advogado.
  app.post("/criar-advogado", async (req, res) => {
    const { escritorio_id, nome, oab, especialidade, email, telefone, ativo } =
      req.body;

    if (escritorio_id == null || !nome || !oab) {
      return res
        .status(400)
        .json({ error: "escritorio_id, nome e oab sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "INSERT INTO advogados (escritorio_id, nome, oab, especialidade, email, telefone, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        escritorio_id,
        nome,
        oab,
        especialidade ?? null,
        email ?? null,
        telefone ?? null,
        ativo ?? 1,
      ]
    );

    return res.status(201).json({ id: resultado.insertId });
  });

  // Busca advogados pelo nome exato informado na URL.
  app.get("/advogados/nome/:nome", async (req, res) => {
    const nome = req.params.nome;

    const [resultado] = await connection.execute(
      "SELECT * FROM advogados WHERE nome = ? ",
      [nome]
    );
    return res.json(resultado);
  });

  // Atualiza os dados de um advogado pelo ID.
  app.put("/advogados/:id", async (req, res) => {
    const { id } = req.params;
    const { escritorio_id, nome, oab, especialidade, email, telefone, ativo } =
      req.body;

    if (!id || escritorio_id == null || !nome || !oab) {
      return res
        .status(400)
        .json({ error: "id, escritorio_id, nome e oab sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "UPDATE advogados SET escritorio_id = ?, nome = ?, oab = ?, especialidade = ?, email = ?, telefone = ?, ativo = ? WHERE id = ?",
      [
        escritorio_id,
        nome,
        oab,
        especialidade ?? null,
        email ?? null,
        telefone ?? null,
        ativo ?? 1,
        id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "advogado nao encontrado" });
    }

    return res.json({ updated: resultado.affectedRows });
  });

  // Deleta um advogado pelo ID.
  app.delete("/advogados/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id e obrigatorio" });
    }

    const [resultado] = await connection.execute(
      "DELETE FROM advogados WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "advogado nao encontrado" });
    }

    return res.json({ deleted: resultado.affectedRows });
  });
};
