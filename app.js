const mysql = require("mysql2/promise");
const express = require("express");
const cors = require("cors");
const registerAdvogadosRoutes = require("./controllers/advogados");
const registerClientesRoutes = require("./controllers/clientes");
const registerEscritoriosRoutes = require("./controllers/escritorios");
const registerProcessosRoutes = require("./controllers/processos");

const app = express();

app.use(express.json());
app.use(cors());

const connection = mysql.createPool({
  host: "localhost", // Seu host do MySQL
  user: "root", // Seu usuario do MySQL
  password: "F848634a", // Sua senha do MySQL
  database: "escritorio_advogados", // nome do BD escritorio_advogados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

registerAdvogadosRoutes(app, connection);
registerClientesRoutes(app, connection);
registerEscritoriosRoutes(app, connection);
registerProcessosRoutes(app, connection);

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`A conexao esta sendo executada na porta ${PORT}`);

  // O codigo abaixo e para testarmos a comunicacao com o MySQL
  const [result] = await connection.execute("SELECT 1");
  if (result) {
    console.log("Conexao ao BD feita com sucesso!");
  }
});
