// Importamos o pool de conexão que você criou no db.js
const db = require('../services/database_connection'); 

// 1. LISTAR COMANDAS (GET)
const getComandas = async (req, res) => {
  try {
    // Usamos SQL para buscar no TiDB
    const [rows] = await db.query('SELECT * FROM comandas');
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Comandas recuperadas com sucesso',
      quantidade: rows.length,
      dados: rows
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar no banco de dados',
      erro: error.message
    });
  }
};

// 2. CRIAR COMANDA (POST)
const createComanda = async (req, res) => {
  try {
    const { mesa, itens, total } = req.body;
    
    // O TiDB gera o ID sozinho se a tabela tiver AUTO_INCREMENT
    // Como 'itens' costuma ser um array/objeto, salvamos como String JSON
    const sql = 'INSERT INTO comandas (mesa, itens, total, status) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [mesa, JSON.stringify(itens), total, 'pendente']);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Comanda criada no TiDB!',
      dados: { id: result.insertId, mesa, itens, total, status: 'pendente' }
    });
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao salvar no banco',
      erro: error.message
    });
  }
};

// 3. ATUALIZAR STATUS (PATCH)
const updateComandaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ mensagem: 'Status é obrigatório' });

    const [result] = await db.query('UPDATE comandas SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Comanda não encontrada' });
    }

    res.status(200).json({ sucesso: true, mensagem: 'Status atualizado!' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

// 4. DELETAR COMANDA (DELETE)
const deleteComanda = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM comandas WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, mensagem: 'Comanda não encontrada' });
    }

    res.status(200).json({ sucesso: true, mensagem: 'Comanda removida com sucesso' });
  } catch (error) {
    res.status(500).json({ sucesso: false, erro: error.message });
  }
};

module.exports = { getComandas, createComanda, updateComandaStatus, deleteComanda };