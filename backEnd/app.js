const express = require("express");
const cors = require("cors");
const connection = require("./conection");
const registerAdvogadosRoutes = require("./controllers/advogados");
const registerClientesRoutes = require("./controllers/clientes");
const registerEscritoriosRoutes = require("./controllers/escritorios");
const registerProcessosRoutes = require("./controllers/processos");

const app = express();

app.use(express.json());
app.use(cors());

registerAdvogadosRoutes(app, connection);
registerClientesRoutes(app, connection);
registerEscritoriosRoutes(app, connection);
registerProcessosRoutes(app, connection);

module.exports = app;
