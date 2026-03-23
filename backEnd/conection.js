const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "F848634a",
  database: process.env.DB_NAME || "escritorio_advogados",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = connection;
