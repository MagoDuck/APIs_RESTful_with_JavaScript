const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./restaurante.db');

db.run(`
  CREATE TABLE IF NOT EXISTS cardapio (
    id INTEGER PRIMARY KEY,
    nome TEXT,
    preco REAL,
    descricao TEXT
  )
`);

db.close(() => console.log('Tabela criada!'));
