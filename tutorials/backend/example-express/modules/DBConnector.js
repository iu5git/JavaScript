const fs = require('fs');
const path = require('path');

class DBConnector {
    constructor(filename) {
        this.filename = filename;
    }

    readFile() {
        return fs.readFileSync(path.join(process.cwd(), 'db', this.filename), "utf8");
    }

    writeFile(data) {
        fs.writeFileSync(path.join(process.cwd(), 'db', this.filename), data, "utf8");
    }
}

module.exports = {
     DBConnector,
};
