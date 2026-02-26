// Controlador de Comandas (Pedidos)
// Este arquivo é como o "Chef de Pedidos" que recebe e gerencia os pedidos dos clientes

const db = require('../services/database_connection');

// Função que retorna todas as comandas (pedidos) registradas
const getComandas = async (req, res) => {
  try {
    // Busca todas as comandas do banco de dados
    const [rows] = await db.query(`
      SELECT * FROM comandas 
      ORDER BY 
        CASE status
          WHEN 'pendente' THEN 1
          WHEN 'preparando' THEN 2
          WHEN 'pronto' THEN 3
          ELSE 4
        END,
        dataPedido DESC
    `);
    
    // Converte o campo itens de JSON string para array
    const comandas = rows.map(comanda => ({
      ...comanda,
      itens: JSON.parse(comanda.itens)
    }));

    res.status(200).json({
      sucesso: true,
      mensagem: 'Comandas recuperadas com sucesso',
      quantidade: comandas.length,
      dados: comandas
    });
  } catch (error) {
    console.error('Erro ao buscar comandas:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar comandas',
      erro: error.message
    });
  }
};

// Função que cria uma nova comanda (pedido)
const createComanda = async (req, res) => {
  try {
    const { mesa, itens, total } = req.body;

    // Validações básicas
    if (!mesa || !itens || !total) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Mesa, itens e total são obrigatórios'
      });
    }

    // Converte o array de itens para JSON string
    const itensJSON = JSON.stringify(itens);

    // Insere no banco de dados
    const [result] = await db.query(
      `INSERT INTO comandas (mesa, itens, total, status, dataPedido) 
       VALUES (?, ?, ?, ?, NOW())`,
      [mesa, itensJSON, total, 'pendente']
    );

    // Busca a comanda recém-criada para retornar
    const [novaComanda] = await db.query(
      'SELECT * FROM comandas WHERE id = ?',
      [result.insertId]
    );

    // Converte itens de volta para array
    const comandaFormatada = {
      ...novaComanda[0],
      itens: JSON.parse(novaComanda[0].itens)
    };

    res.status(201).json({
      sucesso: true,
      mensagem: 'Comanda criada com sucesso',
      dados: comandaFormatada
    });
  } catch (error) {
    console.error('Erro ao criar comanda:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao criar comanda',
      erro: error.message
    });
  }
};

// Função para atualizar o status de uma comanda
const updateComandaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validação do status
    const statusPermitidos = ['pendente', 'preparando', 'pronto', 'cancelado'];
    if (!status || !statusPermitidos.includes(status)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Status inválido. Use: pendente, preparando, pronto ou cancelado'
      });
    }

    // Verifica se a comanda existe
    const [comanda] = await db.query(
      'SELECT * FROM comandas WHERE id = ?',
      [id]
    );

    if (comanda.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Comanda não encontrada.'
      });
    }

    // Atualiza o status
    await db.query(
      'UPDATE comandas SET status = ? WHERE id = ?',
      [status, id]
    );

    // Busca a comanda atualizada
    const [comandaAtualizada] = await db.query(
      'SELECT * FROM comandas WHERE id = ?',
      [id]
    );

    // Converte itens para array
    const comandaFormatada = {
      ...comandaAtualizada[0],
      itens: JSON.parse(comandaAtualizada[0].itens)
    };

    res.status(200).json({
      sucesso: true,
      mensagem: 'Status atualizado com sucesso',
      dados: comandaFormatada
    });

  } catch (error) {
    console.error('Erro ao atualizar comanda:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao atualizar comanda',
      erro: error.message
    });
  }
};

// Função para deletar uma comanda
const deleteComanda = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se a comanda existe
    const [comanda] = await db.query(
      'SELECT * FROM comandas WHERE id = ?',
      [id]
    );

    if (comanda.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Comanda não encontrada.'
      });
    }

    // Deleta a comanda
    await db.query('DELETE FROM comandas WHERE id = ?', [id]);

    res.status(200).json({
      sucesso: true,
      mensagem: 'Comanda deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar comanda:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao deletar comanda',
      erro: error.message
    });
  }
};

// Exporta as funções para serem usadas nas rotas
module.exports = {
  getComandas,
  createComanda,
  updateComandaStatus,
  deleteComanda 
};