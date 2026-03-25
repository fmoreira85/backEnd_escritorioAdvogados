const app = require("./app");
const connection = require("./conection");

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`A conexao esta sendo executada na porta ${PORT}`);

  try {
    const [result] = await connection.execute("SELECT 1");
    if (result) {
      console.log("Conexao ao BD feita com sucesso!");
    }
  } catch (error) {
    console.error(
      "API iniciou, mas nao foi possivel validar conexao com o banco:",
      error.message
    );
  }
});
