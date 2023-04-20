# Методические указания по выполнению лабораторной работы JavaScript

## План

1. Что такое Node.js?
2. Возможности Node.js и способы применения в production-среде
3. Небольшие примеры скриптов
4. Пишем "голую" простую API
5. Пишем API на express
6. Добавляем в проект структуру (рефакторим код)
7. Добавляем внешний клиент (то самое BFF)
8. Что еще умеет Node.js

## 1. Что такое Node.js

Вы уже успели познакомиться с node.js в 3 лабораторной работе. но чтобы освежить в памяти вспомним снова.

JavaScript код, который мы пишем при обычной клиентской разработке, исполняется в браузере. В браузере у нас есть компилятор JavaScript кода в машинных код, в Google Chrome это движок [V8][v8]. Если мы хотим запускать код на нашем компьютере, а не в браузере, то нам нужно использовать [Node.js][node]. Node - это программная платформа, которая позволяет компилировать JavaScript код в машинный на нашем компьютере. На самом деле, за основу Node.js взять тот же самый движок [V8][v8]. Node.js добавляет возможность нам взаимодействовать с утройствами ввода-вывода, подключать внешние библиотеки.

## 2. Возможности Node.js и способы применения в production-среде

Писать на Node.js можно практически все: веб-сервера, десктопные и мобильные приложения, и даже программировать микроконтроллеры. В данной лабораторной работе мы остановимся на первом варианте, наиболее часто используемом, написании веб-серверов. Чаще всего на Node.js пишут именно BFF (Backend-For-Frontend), но на этом мы остановимся подробнее позже.

Также очень часто на Node.js пишут различные скрипты для того, чтобы автоматизировать различные процессы в инфраструктуре клиентской разработки. Например: автоматизация деплоя, различные автогенерации и тд.

## 3. Небольшие примеры скриптов

Рассмотрим несколько примеров скриптов, чтобы поподробнее посмотреть, как именно работает Node.js.

```ecmascript 6
const {writeFileSync, readFileSync} = require('fs');
const path = require('path');

function doMusic() {
	return 'listen to radiohead, guys';
}

writeFileSync(path.join(__dirname, 'wisdom-book.txt'), doMusic());
```

Как мы видим синтаксис идентичен синтаксису обычного javascript.
В Node.js используется модульная система CommonJS. Подробнее про модульные системы можно почитать [здесь](https://habr.com/ru/company/nix/blog/261141/).

Еще пример:

```ecmascript 6
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function countNumbers(str){
    let count = 0;
    for (let i = 0; i < str.length; ++i) {
        if (!Number.isNaN(Number.parseInt(str))) {
            count++;
        }
    }

    return count;
}


rl.once('line', (line) => {
    console.log(countNumbers(line));

    rl.close();
});
```

Скрипт выше принимает строку из ввода консоли и выводит сколько в ней цифр.

У Node.js большое число встроенных библиотек, в примере выше мы видим библиотеку `readline` для работы с вводом/выводом.
В предыдущем примеры мы использовали библиотеку `fs` для работы с файловой системой.

## 4. Пишем "голую" простую API

Также в Node.js есть стандратная библиотека для написания http-серверов. Давайте ее попробуем.
Создаем файл `server.js`.
Подключаем библиотеку:
```ecmascript 6
const http = require("http");
```

Далее в переменных объявляем на каком хосте и порте будет крутиться наш сервер.
В данном случае это наш локальный адрес и 8000 порт:

```ecmascript 6
const host = 'localhost';
const port = 8000;
```

Теперь объявим функцию, которая будет принимать запросы и отправлять ответы.
У этой функции есть определенный формат: принимает два аргумента `req` - http-запрос, `res` - http-ответ.
В примере внизу наш обработчик на любой запрос отдает статус `200 ОК` и в теле ответ `Курс ПСП такой крутой!`.
```ecmascript 6
const handler = (req, res) => {
    res.writeHead(200);
    res.end('Курс ПСП такой крутой!');
};
```

Наконец объявим сервер и заиспользуем созданные нами функцию и переменные:
```ecmascript 6
const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});
```

Итого получаем скрипт:

```ecmascript 6
const http = require("http");

const host = 'localhost';
const port = 8000;

const handler = (req, res) => {
    res.writeHead(200);
    res.end('Курс ПСП такой крутой!');
};

const server = http.createServer(handler);
server.listen(port, host, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});
```

Запускаем наш сервер командой:

```shell
node server.js
```

Видим, в консоли вывод:

`Сервер запущен по адресу http://localhost:8000`

И далее консоль зависает. В этом процессе начинает бесконечно слушать подключения наш http-сервер.
Откроем новое окно консоли (не закрывая предыдущее) и пишем:

```shell
curl http://localhost:8000
```

И видим ответ:
```shell
Курс ПСП такой крутой!
```

Поздравляю! Вы написали свой http-сервер на node.js.

## 5. Пишем API на express

В реальности на веб-серверах у нас бывает гораздо больше обработчиков,
и приходится выстраивать очень сложную структуру с большим количеством бизнес-логики. Для упрощения процесса разработки написали фреймворк `express`.

Т.к. express это библиотека, ее необходимо устанавливать отдельно командой:

```shell
npm i express
```

Теперь перепишем скрипт выше и получим:

```ecmascript 6
const express = require('express');

const app = express(); // 1

const host = 'localhost';
const port = 8000;

const handler = (req, res) => {
    res.writeHead(200);
    res.end('ПСП такой крутой!');
};

app.all('*', handler); // 2

app.listen(port, host, () => { // 3
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});
```

В комментарии помеченном `// 1` мы создаем приложение. Далее в `// 2` мы объявляем,
что на все запросы по любому пути (путь указывается первым аргументом в определенном формате) обрабатывай
с помощью функции `handler`.

Теперь давайте уберем помеченный обработчик `// 2` создадим побольше разных обработчиков, и потестируем их:

```ecmascript 6
app.get('/music', (req, res) => {
    res.end('Я слушаю только Radiohead!');
});

app.get('/course', (req, res) => {
    res.json({ course: 'ПСП' });
});
```

Теперь у нас есть 2 обработчика по 2-м разным адресам `/music` и `/course`.

Можем протестировать их при помощи утилиты curl и увидеть:
```shell
$ curl http://localhost:8000/music

Я слушаю только Radiohead!%  

$ curl http://localhost:8000/course

{"course":"ПСП"}
```

### API с акциями для приложения из 3-4 лабораторной работы

В 3 лабораторной работе в приложении давался пример, где данные возвращала функция `getData()`.
Давайте вынесем отправку данных на сервер, а с клиентской части будем делать `fetch` на написанный нами сервер.

Создадим файл `stocks.json` рядом с `server.js`. Это будет нашей своеобразной базой-данных. Поместим туда вот эти данные:
```shell
[
    {
        "id": 1,
        "src": "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
        "title": "Акция",
        "text": "Такой акции вы еще не видели 1"
    },
    {
        "id": 2,
        "src": "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
        "title": "Акция",
        "text": "Такой акции вы еще не видели 2"
    },
    {
        "id": 3,
        "src": "https://i.pinimg.com/originals/c9/ea/65/c9ea654eb3a7398b1f702c758c1c4206.jpg",
        "title": "Акция",
        "text": "Такой акции вы еще не видели 3"
    }
]
```

И теперь создадим 2 обработчика: `/stocks` для получения всех акций, и `/stock/:id` для получения одной акции по ее id.

Чтобы читать файла напишем функцию `readJson`, которая умеет читать файл и парсить его в объект в javascript:

```ecmascript 6
const readJson = (fileName) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf8");
    const json = JSON.parse(file);

    return json;
};
```

Теперь обработчик получения всех акций:

```ecmascript 6
const storageName = 'stocks.json';

app.get('/stocks', (req, res) => {
    const stocks = readJson(storageName);
    res.send(stocks);
});
```

Сначала читаем данные из файла, и затем их отдаем. Теперь напишем обработчик для получения одной акции по ее id. Здесь будет
на порядок сложнее:

```ecmascript 6
app.get('/stocks/:id', (req, res) => {
    const id = req.params.id; // 1
    
    const numberId = Number.parseInt(id);
    if (Number.isNaN(numberId)) { // 2
        res.status(400).send({status: 'Bad Request', message: 'id must be number!'});
    }

    const stocks = readJson(storageName);
    const stock = stocks.find((value) => { // 3
        return value.id === numberId;
    });

    if (stock) { // 4
        res.send(stock);
    } else {
        res.status(404).send({status: 'Not Found', message: `not found stock with id ${numberId}`});
    }
});
```

В `// 1` мы достаем из url запроса параметр id. Т.е. если, например, будет сделан запрос на адрес `http://localhost:8000/stocks/2`,
то `req.params.id` вернет нам 2 и тд. Название для поля `id` берет из адреса который мы указали: `/stocks/:id`. Т.е. в теории мы могли
бы его поменять на что-нибудь вроде `/stocks/:stock` и доставать из запроса так `req.params.stock`.

Далее в `// 2` мы проверяем, что `id`, который нам передали - это число. И если нет, то отдаем ошибку со статусом 400.

В `// 3` мы, уже считав данные из файла, используем метод find для поиска элемента с таким id. Если такой элемент не найдется,
то в переменную `stock` запишется `undefined`.

И уже в `// 4` проверяем смогли ли мы найти акцию с переданным `id`. Если не смогли, то отдаем ошибку с 404 статусом.

Весь код представлен ниже:

```ecmascript 6
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express(); // 1

const host = 'localhost';
const port = 8000;

const readJson = (fileName) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf8");

    return JSON.parse(file);
};

const storageName = 'stocks.json';

app.get('/stocks', (req, res) => {
    const stocks = readJson(storageName);
    res.send(stocks);
});

app.get('/stocks/:id', (req, res) => {
    const id = req.params.id;
    const numberId = Number.parseInt(id);

    if (Number.isNaN(numberId)) {
        res.status(400).send({status: 'Bad Request', message: 'id must be number!'});
    }

    const stocks = readJson(storageName);
    const stock = stocks.find((value) => {
        return value.id === numberId;
    });

    if (stock) {
        res.send(stock);
    } else {
        res.status(404).send({status: 'Not Found', message: `not found stock with id ${numberId}`});
    }
});

app.listen(port, host, () => { // 3
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});
```

У нас готов полноценный бэкенд на node.js! Но давайте теперь его немного причешем, и добавим в проект структурированности.

## 6. Добавляем в проект структуру (рефакторим код)

Основу для всех архитектур бэкенда является разделение на отображение, бизнес логику и работу с данными. В зависимости от различных подходов в архитектуры могут вноситься какие-то различные детали и дополнительные слои, но эти 3 слоя - это база.

Давайте разделим нашу сущность акций на четыре слоя: controller (отображение или сетевой слой), service (бизнес-логика), repository (низкоуровневая работа с базой),
DAO (более высокоуровневая работа с данными из БД).

Создаем папки `internal`, `db`, `modules`. Далее внутри папки `internal` создаем папку `stocks` и внутри нее 4 файла:
`StocksController.js`, `StocksService.js`, `StocksRespository.js`, `StocksDAO.js` и `index.js`. 

Внутрь modules кладем файл `DBConnector.js` - это базовый класс, умеющий читать и писать в json-файл (нашу импровизированную БД).

В директорию `db` кладем наши json файлы, теперь все они будут лежать там.

Давайте теперь разберем каждый класс по отдельности:

`DBConnector.js`
```ecmascript 6
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
```

При создании инстанса класса DBConnector пробрасывает путь до файла. Также доступны 2 метода для чтение содержимого из файла, и записи в него символов.

Далее рассмотрим `StocksRepository.js`:

```ecmascript 6
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
```

StocksRepository - это можно считать статический класс (или singleton). Доступ к его методам и полям есть только у самого класс,
а не у его инстансов. Здесь мы создаем 1 коннект к нашему файлу `stocks.json` и объявляем методы, которые умеют читать из базы
и писать в нее в формате json.

Это у нас довольно низкоуровневый слой работы с базой. Он умеет только читать и писать какие-то абстрактные данные в файл `stocks.json`.
Теперь рассмотрим, как этой сущностью управляют более высокоуровневые элементы архитектуры.

`StocksDAO.js`
```ecmascript 6
const {StocksRepository} = require('./StocksRepository');

class StockDAO {
    constructor(id, src, title, text) {
        this.id = id;
        this.src = src;
        this.title = title;
        this.text = text;
    }

    static _validateId(id) {
        const numberId = Number.parseInt(id);
        if (Number.isNaN(numberId)) {
            throw new Error('invalidate id');
        }
    }

    static _validate(stock) {
        if (
            stock.id === undefined ||
            stock.src === undefined ||
            stock.title === undefined ||
            stock.text === undefined
        ) {
            throw new Error('invalidate stock data');
        }

        this._validateId(stock.id);
    }

    static find() {
        const stocks = StocksRepository.read();

        return stocks.map(({id, src, title, text}) => {
            return new this(id, src, title, text);
        });
    }

    static findById(id) {
        this._validateId(id);

        const stocks = StocksRepository.read();
        const stock = stocks.find((s) => s.id === id);

        return new this(stock.id, stock.src, stock.title, stock.text);
    }

    static insert(stock) {
        this._validate(stock);

        const stocks = StocksRepository.read();
        StocksRepository.write([...stocks, stock]);

        return new this(stock.id, stock.src, stock.title, stock.text);
    }

    static delete(id) {
        this._validateId(id);

        const stocks = StocksRepository.read();
        const filteredStocks = stocks.filter((s) => s.id !== id);

        StocksRepository.write(filteredStocks);

        return filteredStocks.map(({id, src, title, text}) => {
            return new this(id, src, title, text);
        });
    }

    toJSON() {
        return {
            id: this.id,
            src: this.src,
            title: this.title,
            text: this.text,
        }
    }
}

module.exports = {
    StockDAO,
}
```

В отличие от репозитория, тут уже у нас есть осмысленные методы, которые выполняют какие-то четкие действия связанные с сущностью акций.
Например, добавление новой записи, поиск ее по id, удаление записи по id и тд. 

Наш класс организован таким образом, что его методы привязаны только к самому классу, а поля же привязаны только к его инстансу. 
Что это значит? А то, что когда мы захотим вызвать какой-то метод, мы сможем это сделать вот так:
`const stock = StocksDAO.findById(id)`, и т.к. `findById` возвращает самого себя `return new this(stock.id, stock.src, stock.title, stock.text)`,
то создается инстанс класса `StocksDAO`, который имеет доступ ко всем полям (id, src, title, text), а также методу `toJSON()`. 

Преимущества такого подхода в том, что наш класс умеет не только запрашивать данные, но также хранить их и менеджерить.

Теперь посмотрим как DAO используется в `StocksService.js`:

```ecmascript 6
const {StockDAO} = require('./StockDAO');

class StocksService {
    static findStocks(id) {
        if (id !== undefined) {
            return StockDAO.findById(id).toJSON();
        }

        return StockDAO.find().map((stock) => stock.toJSON());
    }

    static addStock(stock) {
        return StockDAO.insert(stock).toJSON();
    }

    static deleteStock(id) {
        return StockDAO.delete(id).map((stock) => stock.toJSON());
    }
}

module.exports = {
    StocksService,
}
```

Класс `StocksService` также является статическим. Он работает напрямую с данными и абсорбирует бизнес-логику более высокого уровня.
Для данной сущности нет хорошего примера, но это могли бы быть какие-то вычисления, разграничения прав и различная логика обработки данных.

Теперь наконец перейдем к сетевому слою, и рассмотрим файл `StocksController.js`:
```ecmascript 6
const {StocksService} = require('./StocksService');

class StocksController {
    static findStocks(req, res) {
        try {
            res.send(StocksService.findStocks());
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static findStockById(req, res) {
        try {
            const id = Number.parseInt(req.params.id);
            res.send(StocksService.findStocks(id))
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static addStock(req, res) {
        try {
            res.send(StocksService.addStock(req.body));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }

    static deleteStock(req, res) {
        try {
            const id = Number.parseInt(req.params.id);
            res.send(StocksService.deleteStock(id));
        } catch (err) {
            res.status(400).send({status: 'Bad Request', message: err.message})
        }
    }
}

module.exports = {
    StocksController,
};
```

Класс `StocksController` является статическим. Каждый его метод принимает req и res, для того чтобы принимать запросы, и отдавать на них ответы.
Данная сущность полностью изолирует на себе работу с сетью, и дальше все методы передаются внутрь `express.router`. 
Подробнее мы это можем увидеть в файле `index.js` внутри папки `stocks`.

```ecmascript 6
const express = require('express');
const {StocksController} = require('./StocksController');

const router = express.Router();

router.get('/', StocksController.findStocks);
router.get('/:id', StocksController.findStockById);
router.post('/', StocksController.addStock);
router.delete('/:id', StocksController.deleteStock);

module.exports = router;
```

Здесь мы создаем роутер, и назначаем каждый метод нашего контроллера на определенный http-метод и url.

Далее в самом главном файле `index.js` в корне проекта, мы используем этот роутер под общим урлом `/stocks`:

```ecmascript 6
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
```

Теперь наше API умеет читать акции, создавать, а также удалять их.

## 7. ЗАДАНИЕ

1. Необходимо в ваши проекты с 3-5 лабораторную работу добавить возможность добавления и удаления карточек.
2. Удалить все `getData()` и заменить их на походы в написанное вами API.
3. Написать бэкенд на Node.js на примере данного, который будет возвращать данные (которые раньше лежали в `getData`) для вашего приложения. 

## 8. ДОП. ЗАДАНИЕ

Для сильных ребят предоставляется возможность реализовать свой BFF. 
Т.е. перенести логику работы с VK API на бэкенд, который будет как бы прослойкой между клиентским приложением и VK API.
Чтобы правильно это сделать, напишите в телеграм @nathan_kith. Я подскажу, как это лучше сделать и дам рекомендации.

Что вы за это получите? ~~Полезный опыт~~
Возможность попасть на стажировку в Яндекс. Пишите в телеграм (nathan_kith)!
