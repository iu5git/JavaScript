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
const express = require('express');

const app = express(); // 1

const host = 'localhost';
const port = 8000;

const readJson = (fileName) => {
    const file = fs.readFileSync(path.join(__dirname, fileName), "utf8");
    const json = JSON.parse(file);

    return json;
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

## 6. Добавляем в проект структуру (рефакторим код)

## 7. Добавляем внешний клиент (то самое BFF)

## 8. Что еще умеет Node.js
