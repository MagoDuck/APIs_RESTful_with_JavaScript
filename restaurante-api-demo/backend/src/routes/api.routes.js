// Arquivo de Rotas da API
const express = require('express');
const router = express.Router();

// Importa os controladores
const cardapioController = require('../controllers/cardapio.controller');
const comandasController = require('../controllers/comandas.controller');

// ========== ROTAS DO CARDÁPIO ==========
// Retorna todo o cardápio
router.get('/cardapio', cardapioController.listarCardapio);

// Retorna um item específico do cardápio por ID
router.get('/cardapio/:id', cardapioController.getCardapioItem);

// ========== ROTAS DAS COMANDAS ==========
// Retorna todas as comandas (Onde estava dando o erro 404)
router.get('/comandas', comandasController.getComandas);

// Cria uma nova comanda
router.post('/comandas', comandasController.createComanda);

// Atualiza o status de uma comanda (ex: de 'pendente' para 'entregue')
router.patch('/comandas/:id', comandasController.updateComandaStatus);

// Deleta uma comanda do sistema
router.delete('/comandas/:id', comandasController.deleteComanda);

// Exporta o router para ser usado no server.js
module.exports = router;