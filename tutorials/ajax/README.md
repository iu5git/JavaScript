# Простое веб-приложение. Работа с Api

**Цель** данной лабораторной работы - взаимодействие с внешним Api через XMLHttpRequest. В ходе выполнения работы, вам предстоит ознакомиться с кодом реализации простого взаимодействия с внешним Api, получение данных и вывод их в интерфейс пользователя, и затем выполнить задания по варианту.

## План

1. Инструменты для работы
2. Что такое XMLHttpRequest
3. Работа с Api
4. Api главной страницы
5. Api страницы пользователя

## 1. Инструменты для работы

Для работы будем использовать инструменты из предыдущих лабораторной работы: [VS Code][vs-code] + [Live Server][vs-code-live-server].

**Перед началом работы необходимо установить на свой компьютер [Node.js][node-install].**

## 2. Что такое XMLHttpRequest

[XMLHttpRequest][xml] (или XHR) позволяет делать HTTP-запросы к серверу из браузера без перезагрузки страницы.
Несмотря на наличие слова "XML" в названии, с помощью XHR можно работать с любыми типами данных, а не только с XML.
С помощью XML можно загружать/скачивать файл, отслеживать прогрусс и многое другое.

## 3. Работа с Api

Перед началом работы с Api разберемся с тем, как мы это будем делать в нашем проекте.
Первое с чего стоит начать - создадим еще один слой, где будем держать все методы работы с Api.

Сейчас структура проекта выглядит так

```bash
├── pages
├── components
├── index.html
├── main.js
```

Добавим еще один слой `modules`

```bash
├── pages
├── components
├── modules
├── index.html
├── main.js
```

### Работа с константами

При работе нам понадобяться константы, чтобы не разрбрасывать их по всему проекты создадим отдельный файл под константы.

* Создаем файл `modules/consts.js`

```js
export const groupId = GROUP_ID
export const accessToken = 'ACCESS_TOKEN'
export const version = '5.131'
```

Описание полей:

* groupId - id группы, которую мы создали
* accessToken - секретный ключ нашей группы
* version - версия VK Api

Теперь, если нам нужно где-то получить константы, то мы просто импортируем файл и получаем наши константы.

### Работа с урлами

Для работы нам понадобятся урлы вк, чтобы их не объявлять сразу в коде, то сделаем отдельный файл для этого.

* Создаем файл `modules/urls.js`

```js
import {accessToken, version} from "./consts.js";

class Urls {
    constructor() {
        this.url = 'https://api.vk.com/method'
        this.commonInfo = `access_token=${accessToken}&v=${version}`
    }

    getUserInfo(userId) {
        return `${this.url}/users.get?user_ids=${userId}&fields=photo_400_orig&${this.commonInfo}`
    }

    getGroupMembers(groupId) {
        return `${this.url}/groups.getMembers?group_id=${groupId}&fields=photo_400_orig&${this.commonInfo}`
    }
}

export const urls = new Urls()
```

Теперь, если нам нужно получить урл, то просто импортируем файл и получаем нужный нам урл.

```js
import {urls} from "./urls.js";

urls.getGroupMembers()
```

### Работа с Api

Мы будем работать с VK Api через XHR. Для удобства создадим класс, в котом опишем методы для работы с Api.

* Создаем файл `modules/ajax.js`

```js
class Ajax {
    post(url, callback) {
        let xhr = new XMLHttpRequest()
        xhr.open('POST', getUrl(url))
        xhr.send()

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                const data = JSON.parse(xhr.response)
                callback(data)
            }
        }
    }
}

export const ajax = new Ajax();
```

У нас есть готовый класс, через который мы можем выполнить POST запрос. Тут уже происходит вся нужная обработка и формирование JSON объекта из данных и вызов колбека. Если нужно будет, то в будущем мы можем сюда добавить GET, PUT, DELETE запросы.

```js
import {ajax} from "./ajax.js";

ajax.post()
```

## 4. Api главной страницы

Переведем нашу главную страницу на работу с Api.
Сделаем так, чтобы на главной странице выводились пользователи нашей группы.

Первое с чего нужно начать - модифицировать получение данных.
Сейчас мы рисуем карточки на основе объекта в коде.
Нам нужно поменять на получение данных из Api и отрисовку карточек.

* Изменяем функцию получения данных

```js
import {ajax} from "../../modules/ajax.js";
import {urls} from "../../modules/urls.js";
import {groupId} from "../../modules/consts.js";


getData() {
    ajax.post(urls.getGroupMembers(groupId), (data) => {
        this.renderData(data.response.items)
    })
}
```

* Добавляем функцию отрисовки карточек по данным

```js
renderData(items) {
    items.forEach((item) => {
        const productCard = new ProductCardComponent(this.pageRoot)
        productCard.render(item, this.clickCard.bind(this))
    })
}
```

* Модифицируем функцию отрисовки страницы

```js
render() {
    this.parent.innerHTML = ''
    const html = this.getHTML()
    this.parent.insertAdjacentHTML('beforeend', html)

    this.getData()
}
```

Так же нужно поменять структуру компонента `ProductCardComponent` под новое Api.
У нас теперь передаются новые поля, которые нужно учитывать.
В нашем Api нет полей `src`, `title` и `text`, необходимо заменить их на те поля, что есть в нашем Api.

```js
getHTML(data) {
    return (
        `
            <div class="card" style="width: 300px;">
                <img class="card-img-top" src="${data.photo_400_orig}" alt="картинка">
                <div class="card-body">
                    <h5 class="card-title">${data.first_name} ${data.last_name}</h5>
                    <button class="btn btn-primary" id="click-card-${data.id}" data-id="${data.id}">Нажми на меня</button>
                </div>
            </div>
        `
    )
}
```

Теперь на главной странице у нас отображаются все пользователи нашей группы.
Перейдем к модификации второй страницы.

## 5. Api страницы пользователя

Модифицируем страницу так, чтобы отображать данные пользователя, на которые нажали.

* Изменяем функцию получения данных

```js
 getData() {
    ajax.post(urls.getUserInfo(this.id), (data) => {
        this.renderData(data.response)
    })
}
```

* Добавляем функцию отрисовки карточек по данным

```js
renderData(item) {
    const product = new ProductComponent(this.pageRoot)
    product.render(item[0])
}
```

* Модифицируем функцию отрисовки страницы

```js
render() {
    this.parent.innerHTML = ''
    const html = this.getHTML()
    this.parent.insertAdjacentHTML('beforeend', html)

    const backButton = new BackButtonComponent(this.pageRoot)
    backButton.render(this.clickBack.bind(this))
    
    this.getData()
}
```

Нам нужно поменять структуру компонента `ProductComponent`, так же как мы сделалил с компонентом `ProductCardComponent`

```js
getHTML(data) {
    return (
        `
            <div class="card mb-3" style="width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${data.photo_400_orig}" class="img-fluid" alt="картинка">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${data.first_name} ${data.last_name}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `
    )
}
```

## Задание

Создать двухстраничное приложение из примера по вариантам.
Вариант состоит из 2 методов и доп фильтра на эти методы.

Варианты:

### 1 вариант

Главная страница - [groups.getMembers](https://dev.vk.com/method/groups.getMembers).
Получаем список пользователей группы и отображаем их.
Необходимо сделать компонент для фильтра `sort` (см. groups.getMembers -> Параметры -> sort).

Вторая страница - [users.get](https://dev.vk.com/method/users.get).
Отображаем выбранного пользователя на первой странице.

### 2 вариант

Главная страница - [groups.getMembers](https://dev.vk.com/method/groups.getMembers).
Получаем список пользователей группы и отображаем их.
Необходимо сделать компонент для фильтра `filter` (см. groups.getMembers -> Параметры -> filter).

Вторая страница - [users.get](https://dev.vk.com/method/users.get).
Отображаем выбранного пользователя на первой странице.

### 3 вариант

Главная страница - [messages.getConversationMembers](https://dev.vk.com/method/messages.getConversationMembers).
Получаем список участников беседы и отображаем их.
У группы можно создать чат.
Необходимо сделать несколько чатов у группы и добавить компонент для выбора `peer_id` (см. messages.getConversationMembers -> Параметры -> peer_id).

Вторая страница - [users.get](https://dev.vk.com/method/users.get).
Отображаем выбранного пользователя на первой странице.

### 4 вариант

Главная страница - [messages.getConversations](https://dev.vk.com/method/messages.getConversations).
Получаем список чатов и отображаем их.
У группы можно создать несколько чатов.
Необходимо сделать компонент для фильтра `filter` (см. messages.getConversations -> Параметры -> filter).

Вторая страница - [messages.getConversationsById](https://dev.vk.com/method/messages.getConversationsById).
Отображаем выбранный чат на первой странице.

## Полезные ссылки

1. Почитать про **XMLHttpRequest** [тут][xml]
2. Почитать про **VK Api** [тут][vk-api]

[vs-code]: https://code.visualstudio.com
[vs-code-live-server]: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer
[node-install]: https://nodejs.org/en/download
[xml]: https://learn.javascript.ru/xmlhttprequest
[vk-api]: https://dev.vk.com/reference
[vk-api-group-key]: https://dev.vk.com/api/access-token/getting-started#Ключ%20доступа%20сообщества
[vk-api-create-group]: https://vk.com/groups?w=groups_create
[cors-unblock]: https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino/related
