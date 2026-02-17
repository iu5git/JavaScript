const stocksService = require('../services/stocksService');

const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

const getStockById = (req, res) => {
    const id = parseInt(req.params.id);
    const stock = stocksService.findOne(id);
    
    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.json(stock);
};

const createStock = (req, res) => {
    const { src, title, text } = req.body;
    
    // Простая валидация
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }
    
    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

const updateStock = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedStock = stocksService.update(id, req.body);
    
    if (!updatedStock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.json(updatedStock);
};

const deleteStock = (req, res) => {
    const id = parseInt(req.params.id);
    const success = stocksService.remove(id);
    
    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    
    res.status(204).send(); // 204 No Content
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};
