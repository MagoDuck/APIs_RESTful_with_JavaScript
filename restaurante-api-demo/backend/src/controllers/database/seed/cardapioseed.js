const { cardapio } = require("../mock/cardapio_mock"); // ajuste o caminho conforme sua pasta

async function seedCardapio(pool) {
  console.log("Populando cardapio...");

  const conn = await pool.getConnection();
  try {
    // Limpa a tabela antes de popular
    await conn.query("DELETE FROM cardapio");

    for (const item of cardapio) {
  await conn.query(
    "INSERT INTO cardapio (id, nome, preco, descricao) VALUES (?, ?, ?, ?)",
    [item.id, item.nome, item.preco, item.descricao]
  );
}


    console.log("Tabela cardapio populada!");
  } catch (err) {
    console.error("Erro ao popular tabela cardapio:", err);
  } finally {
    conn.release();
  }
}

// Exporta a função para o orquestrador
module.exports = seedCardapio;
