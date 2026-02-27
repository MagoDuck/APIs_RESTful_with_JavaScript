// Controlador do Cardápio
// Este arquivo é como o "Chef de Cozinha" que mostra o menu aos clientes

const db = require('../services/database_connection');

// Função que retorna todo o cardápio
// Quando o cliente pede para ver o menu, essa função é executada
const listarCardapio = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cardapio ORDER BY nome');

    res.json({
      sucesso: true,
      cardapio: rows
    });
  } catch (error) {
    console.error('Erro ao listar cardápio:', error);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao listar cardápio' 
    });
  }
}; // ✅ Fechamento correto!

// Função que retorna um item específico do cardápio pelo ID
const getCardapioItem = async (req, res) => { // ✅ Adicionado async
  try {
    const id = parseInt(req.params.id);
    
    // Busca no BANCO DE DADOS, não no array
    const [rows] = await db.query('SELECT * FROM cardapio WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Item não encontrado'
      });
    }

    res.status(200).json({
      sucesso: true,
      dados: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar item do cardápio',
      erro: error.message
    });
  }
};

// Exporta as funções para serem usadas nas rotas
module.exports = {
  listarCardapio,
  getCardapioItem // ✅ Adicionado!
};