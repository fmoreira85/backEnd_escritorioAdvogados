const app = require("./app");
const connection = require("./conection");

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`A conexao esta sendo executada na porta ${PORT}`);

  const [result] = await connection.execute("SELECT 1");
  if (result) {
    console.log("Conexao ao BD feita com sucesso!");
  }
});
