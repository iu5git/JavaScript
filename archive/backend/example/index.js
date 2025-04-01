const express = require('express');

const stocks = require('./internal/stocks');

const app = express();

const host = 'localhost';
const port = 8000;

app.use(express.json());

app.use('/stocks', stocks);

app.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});