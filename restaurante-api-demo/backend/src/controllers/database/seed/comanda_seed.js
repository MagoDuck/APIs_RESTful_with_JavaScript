const comandasData = require("../mock/comandas.mock.js");

async function seedComandas(pool) {
  const conn = await pool.getConnection();
  try {
    console.log("Populando comandas...");
    await conn.query("DELETE FROM comandas");

    for (const comanda of comandasData) {
      await conn.query(
        "INSERT INTO comandas (mesa, itens, total, status, dataPedido) VALUES (?, ?, ?, ?, ?)",
        [comanda.mesa, comanda.itens, comanda.total, comanda.status, comanda.dataPedido]
      );
    }

    console.log("Tabela comandas populada!");
  } catch (err) {
    console.error("Erro ao popular tabela comandas:", err);
  } 
}

module.exports = seedComandas;
