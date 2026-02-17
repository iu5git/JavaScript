const express = require('express');
const router = express.Router();
const stocksController = require('../controllers/stocksController');

// Определение маршрутов
router.get('/', stocksController.getAllStocks);
router.get('/:id', stocksController.getStockById);
router.post('/', stocksController.createStock);
router.patch('/:id', stocksController.updateStock);
router.delete('/:id', stocksController.deleteStock);

module.exports = router;
