// seed.js
const pool = require("../src/services/database_connection.js"); // importa o pool do db.js
const seedCardapio = require("./controllers/database/seed/cardapioseed.js");
const seedComandas = require("./controllers/database/seed/comanda_seed.js");

async function seedAll() {

  try {
    await seedCardapio(pool);   // primeiro cardápio
    await seedComandas(pool);   // depois comandas
    console.log("Todas as seeds executadas com sucesso!");
  } catch (err) {
    console.error("Erro no orquestrador:", err);
  } finally {
    await pool.end(); // encerra o pool
  }
}

seedAll();
