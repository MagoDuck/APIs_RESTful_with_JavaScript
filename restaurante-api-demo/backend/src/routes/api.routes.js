// Arquivo de Rotas da API - CORRIGIDO
const express = require('express'); // ✅ APENAS UMA VEZ!
const router = express.Router(); // ✅ Cria o router AQUI, no início

// Importa os controladores
const cardapioController = require('../controllers/cardapio.controller');
const comandaController = require('../controllers/comandas.controller'); // ✅ Nome corrigido

// ========== ROTAS DO CARDÁPIO ==========
// GET /api/cardapio - Retorna todo o cardápio
router.get('/cardapio', cardapioController.listarCardapio);

// GET /api/cardapio/:id - Retorna um item específico
router.get('/cardapio/:id', cardapioController.getCardapioItem);

// ========== ROTAS DE COMANDAS ==========
// GET /api/comandas - Lista todas as comandas
router.get('/comandas', comandaController.getComandas);

// POST /api/comandas - Cria nova comanda
router.post('/comandas', comandaController.createComanda);

// PATCH /api/comandas/:id - Atualiza status
router.patch('/comandas/:id', comandaController.updateComandaStatus);

// DELETE /api/comandas/:id - Deleta comanda
router.delete('/comandas/:id', comandaController.deleteComanda);

module.exports = router; // ✅ Exporta o router