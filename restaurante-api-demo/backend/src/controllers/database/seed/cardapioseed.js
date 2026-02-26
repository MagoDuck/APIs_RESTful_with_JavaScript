const { cardapio } = require("../mock/cardapio_mock");

async function seedCardapio(pool) {
  console.log("🍽️ Populando cardápio...");

  if (!cardapio || !Array.isArray(cardapio) || cardapio.length === 0) {
    console.error("❌ Dados do cardápio inválidos ou vazios!");
    return;
  }

  const conn = await pool.getConnection();
  try {
    // Opcional: Resetar AUTO_INCREMENT
    await conn.query("DELETE FROM cardapio");
    await conn.query("ALTER TABLE cardapio AUTO_INCREMENT = 1");

    for (const item of cardapio) {
      // Validação básica dos dados
      if (!item.nome || !item.preco) {
        console.warn(`⚠️ Item inválido ignorado:`, item);
        continue;
      }

      await conn.query(
        "INSERT INTO cardapio (nome, preco, descricao) VALUES (?, ?, ?)",
        [item.nome, item.preco, item.descricao || '']
      );
      // ✅ Removido o 'id' do INSERT - deixe o AUTO_INCREMENT gerar
    }

    const [result] = await conn.query("SELECT COUNT(*) as total FROM cardapio");
    console.log(`✅ Cardápio populado! Total: ${result[0].total} itens`);
  } catch (err) {
    console.error("❌ Erro ao popular tabela cardapio:", err);
  } finally {
    conn.release(); // ✅ ESSENCIAL!
  }
}

module.exports = seedCardapio;