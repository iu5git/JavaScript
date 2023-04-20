const {DBConnector} = require('../../modules/DBConnector');

class StocksRepository {
    static db = new DBConnector('stocks.json');

    static read() {
        const file = this.db.readFile();

        return JSON.parse(file);
    }

    static write(json) {
        this.db.writeFile(JSON.stringify(json));
    }
}

module.exports = {
    StocksRepository,
}
