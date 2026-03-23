module.exports = function registerProcessosRoutes(app, connection) {
  // Lista todos os processos cadastrados.
  app.get("/processos", async (req, res) => {
    const [resultado] = await connection.execute("SELECT * FROM processos");
    return res.json(resultado);
  });

  // Cria um novo processo.
  app.post("/criar-processo", async (req, res) => {
    const { escritorio_id, advogado_id, cliente_id, numero, titulo, status, descricao } =
      req.body;

    const [resultado] = await connection.execute(
      "INSERT INTO processos (escritorio_id,advogado_id,cliente_id,numero,titulo,status,descricao) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        escritorio_id,
        advogado_id,
        cliente_id,
        numero ?? null,
        titulo ?? null,
        status ?? null,
        descricao ?? null,
      ]
    );

    return res.status(201).json({ id: resultado.insertId });
  });

  // Atualiza os dados de um processo pelo ID.
  app.put("/processos/:id", async (req, res) => {
    const { id } = req.params;
    const { escritorio_id, advogado_id, cliente_id, numero, titulo, status, descricao } =
      req.body;

    if (!id || !escritorio_id) {
      return res.status(400).json({ error: "id e escritorio_id sao obrigatorios" });
    }

    const [resultado] = await connection.execute(
      "UPDATE processos SET escritorio_id = ?, advogado_id = ?, cliente_id = ?, numero = ?, titulo = ?, status = ?, descricao = ? WHERE id = ?",
      [
        escritorio_id,
        advogado_id ?? null,
        cliente_id ?? null,
        numero ?? null,
        titulo ?? null,
        status ?? null,
        descricao ?? null,
        id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "processo nao encontrado" });
    }

    return res.json({ updated: resultado.affectedRows });
  });

   app.delete("/processos/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "id e obrigatorio" });
    }

    const [resultado] = await connection.execute(
      "DELETE FROM processos WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: "cliente nao encontrado" });
    }

    return res.json({ deleted: resultado.affectedRows });
  });
};
