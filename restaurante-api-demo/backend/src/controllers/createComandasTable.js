const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./restaurante.db');

db.run(`
  CREATE TABLE IF NOT EXISTS comandas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mesa INTEGER NOT NULL,
    itens TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    dataPedido TEXT NOT NULL
  )
`);

db.close(() => {
  console.log('Tabela comandas criada com sucesso!');
});
