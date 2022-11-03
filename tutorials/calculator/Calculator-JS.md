# ЛР 1. HTML/CSS/JavaScript

**Цель** данной лабораторной работы - знакомство с инструментами построения пользовательских интерфейсов web-сайтов: HTML, CSS, JavaScript. В ходе выполнения работы, вам предстоит ознакомиться с кодом реализации простого калькулятора,  и затем выполнить задания по варианту.

![](assets/prototype.png)

## HTML-разметка

HTML - это язык разметки, с помощью которого описывается содержимое веб-страницы: текстовые поля, таблицы, кнопки, заголовки, ссылки, в общем - все, что пользователь видит на странице. Для использования HTML-элементов на странице используются тэги. В основном на каждый элемент в документе приходится по два тэга: открывающий и закрывающий, но для обозначения некоторых элементов достаточно только открывающего. У тэгов могут быть атрибуты, с помощью которых задается дополнительная информация об html-элементе. Синтаксис объявления html-элемента выглядит примерно так:

```html
<тэг атрибут="значение_атрибута">Содержимое тэга</тэг>
```

Рассмотрим некоторые html-элементы и их тэги: 

### Текст

1. В html присутствуют 6 тэгов для выделения **заголовков**:
    
    ```html
    <h1>Этот текст будет отображен браузером как заголовок первого уровня (крупнейший)</h1>
    <h2>А этот - как заголовок второго уровня (поменьше) </h2>
    ...
    <h6>Самый мелкий заголовок</h6>
    ```
    
2. текст можно форматировать:
    
    ```html
    <i> Этот текст будет отображен курсивом </i>
    <b> этот будет выделен жирным </b>
    <u> а этот будет подчеркнут </u>
    ```
    
3. текст можно группировать в параграф (абзац):
    
    ```html
    <p>Это параграф какого-то текста.</p>
    <p>Следующий параграф текста</p>
    ```
    

### Списки

1. ненумерованный список (unordered list UL)
    
    ```html
    <ul> <!-- начинаем ненумерованный список-->
    	<li> первый элемент списка </li>
    	<li> второй элемент списка </li>
    	<li> третий элемент списка </li>
    </ui> <!-- список закончен -->
    ```
    
2. Нумерованный список (ordered list OL):
    
    ```html
    <ol>
    	<li> первый элемент списка </li>
    	<li> второй элемент списка </li>
    </ol>
    ```
    

### Гиперссылки

1. ссылка на ресурс
    
    Для создания ссылки используется парный тэг <a>. У него присутствует несколько атрибутов, позволяющих ссылку настроить:
    
    - `href`- адрес ресурса, на который ссылка ссылается, например https://google.com
    - `target` - в каком фрейме (окне) открывать документ, по умолчанию стоит в текущем.
        
        ```html
        <!-- переход по этой ссылке откроет google.com в текущем окне -->
        <a href="https://google.com"> Click me! </a>
        
        <!-- эта ссылка открое google.com в новом окне браузера -->
        <a href="https://google.com" target="_blank"> Click me! </a>
        ```
        
2. якорь
    
    Внутри HTML-страницы с помощью того-же тэга <a> можно расставить так называемые “якоря”. Грубо говоря, это - закладки на странице. Якоря затем можно использовать в гиперссылках для перемещения к определенному элементу страницы, где установлен якорь. 
    
    ```html
    <p>
    	<a name="some_paragraph"></a>   <!-- устанавливаем якорь -->
    	Lorem Ipsum is simply dummy text of ...
    </p>
    
    <p>
    Следующий параграф текста, в котором мы установим ссылку на якорь.
    <a href="#some_paragraph">При нажатии на эту ссылку, пользователь будет перенаправлен к месту установки якоря.</a>
    </p>
    ```
    

### Базовая структура HTML-документа

Простейший html-документ выглядит следующим образом:

```html
<!DOCTYPE html> <!--Указание браузеру, какой стандарт HTML использовать (сейчас HTML 5 по умолчанию)-->
<html lang="ru"> <!--Начало html-блока. Можно указать язык, чтобы избежать ошибок отображения текста-->

<!-- секция head, как правило, используется для описания служебной и мета информации,
    в ней также можно указывать ссылки на нужные странице ресурсы, например, шрифты, скрипты и т.д.-->
<head>
  <meta charset="UTF-8">             <!--указание кодировки символов-->
  <title>Моя первая страница</title> <!--Заголовок страницы, который будет отображен во вкладке браузера-->
</head>

<!--секция body - это тело документа. Здесь размещается вся информация, которая будет показана на странице-->
<body>
    <h2>Lorem Ipsum</h2>
</body>

</html> <!--конец html-документа -->
```

HTML-элементов существует большое количество, мы рассмотрели лишь небольшую часть. Почитать про другие HTML-тэги, чтобы научиться вставлять изображения, таблицы, поля ввода, формы и прочее можно [здесь](https://www.w3schools.com/html/default.asp).

## Верстка калькулятора

Создайте HTML-файл со следующим содержимым. Здесь определёны все составляющие калькулятора (кнопки и поле вывода результата вычислений). Для каждого активного элемента определен атрибут `id` ( уникальный идентификатор), он потребуется в дальнейшем, чтобы обращаться к элементам из JavaScript.

```html
<!DOCTYPE html>
<html>

<head>
  <title>Калькулятор</title>
</head>

<body>
  <div> <!-- div - это базовый html-контейнер, который может содержать в себе другие html-элементы. -->
    
    <!-- блок с экраном калькулятора, где будет выводиться результат вычислений. -->
    <div id="result">
      0
    </div>

    <!-- блок с кнопками калькулятора. -->
    <div>
	<!--горизонтальный ряд из четырех кнопок-->
	<div>  
	      <button id="btn_cancel">C</button>    <!-- про тэг кнопки: https://www.w3schools.com/tags/tag_button.asp -->
	      <button id="btn_sign">+/-</button>
	      <button id="btn_percent">%</button>
	      <button id="btn_div">/</button>
	</div>

	<div>
	      <button id="btn_7">7</button>
	      <button id="btn_8">8</button>
	      <button id="btn_9">9</button>
	      <button id="btn_mult">x</button>
	</div>	

	<div>
	      <button id="btn_4">4</button>
	      <button id="btn_5">5</button>
	      <button id="btn_6">6</button>
	      <button id="btn_minus">-</button>
	</div>	

	<div>
	      <button id="btn_1">1</button>
	      <button id="btn_2">2</button>
	      <button id="btn_3">3</button>
	      <button id="btn_plus">+</button>
	</div>

	<div>
	      <button id="btn_0">0</button>
	      <button id="btn_dot">.</button>
	      <button id="btn_equal">=</button>
	</div>
    </div>
  
  </div>
</body>
</html>
```

Если открыть этот HTML-документ в браузере, мы получим не самый изящный калькулятор. Чтобы задать параметры внешнего вида элементов, необходимо использовать CSS.


![](assets/nocss.png)

## CSS

CSS (***Cascading Style Sheets***) - каскадные таблицы стилей. С помощью этого инструмента мы можем кастомизировать отображение различных HTML-элементов на странице, например сделать кнопки круглыми или задать им определенный цвет. 

Рассмотрим синтаксис. CSS-правило (стиль) содержит селектор и блок объявлений. Селектор определяет к каким HTML-элементам нужно применить перечисленные в блоке объявлений свойства. 

```css
имя_селектора {          
	свойство1: значение;
	свойство2: значение;          
	...
}                       
```

1. **CSS element Selector**
    
    Существует несколько видов селекторов. Например, если мы хотим задать одинаковые правила для всех заголовков первого уровня, мы можем создать CSS-правило с именем селектора `h1`. Также можно поступить и с другими HTML-элементами.
    
    ```css
    /* css */
    h1 {               
    	color: blue;    
    	font-size: 12px;            
    } 
    ```
    
    ```html
    <!-- HTML -->
    <body>
      <h1>Заголовок</h1>
      <h1>Еще заголовок</h1>
    </body>
    ```
    
    Теперь, при использовании тэга `<h1>` в HTML документе, ко всем заголовкам первого уровня будут применены заданные правила: синий цвет и размер шрифта в 12px.
    
    ![](assets/css-header.png)
    

1. **CSS id Selector**
    
    Селектор по идентификатору позволяет задать правила для конкретного HTML-элемента с конкретным уникальным идентификатором. Имя такого селектора совпадает с идентификатором HTML-элемента, но начинается с решётки:
    
    ```html
    <!-- HTML -->
    
    <div id="my_custom_element">
    	Lorem Ipsum is simply dummy text
    </div>
    ```
    
    ```css
    /*  css */
    #my_custom_element {
          text-align: center;
          color: red;
    }
    ```
    
2. **CSS class Selector**
    
    У HTML-элементов есть атрибут **class**. Классовый селектор применяет заданные CSS свойства к тем HTML-элементам, которые принадлежат конкретному классу. Причем один HTML-элемент может принадлежать сразу к нескольким классам. Имя такого селектора начинается с точки.
    
    ```css
    /* css */
    
    /* синий текст по центру */
    .my-centered-blue { 
    	text-align: center;
    	color: blue;         
    }
    
    /* огромный текст курсивом */
    .my-large-italic { 
    	font-size: xxx-large;
    	font-style: italic;
    }
    ```
    
    ```html
    <!-- HTML -->
    
    <p class="my-centered-blue my-large-italic">
    	Этот параграф принадлежит к двум классам, поэтому комбинирует их свойства
    </p>
    <div class="my-large-italic">
    	Этот блок принадлежит только к классу my-large-italic
    </div>
    ```

    ![](assets/css-selectors.png)
    

Также можно создать классовый селектор, дейсвующий только на конкретный тип HTML-элементов, например на параграфы:

```css
/* css */

p.my-large-italic { 
	font-size: xxx-large;
	font-style: italic;
}
```

# Применение CSS к HTML-документу

Существует несколько вариантов встраивания CSS-правил в HTML-документ. CSS можно расположить в секции `<head>`, в рамках тэга `<style>`

```html
<!-- HTML -->
<head>
	<title>калькулятор</title>
	<style>
		.my-center-red { 
			color: red;
			text-align: center;
		}
	</style>
</head>

<body>
    <p class="my-center-red"> Hello! </p>
</body>
```

Второй, более предпочтительный, вариант - описание CSS стилей в отдельном файле, подключить который к HTML-документу можно сославшись на него в секции `head`:

```html
<head> 
  <title>калькулятор</title>
	<!-- указываем, что файл style.css содержит таблицу стилей (stylesheet) -->
	<link rel="stylesheet" href="style.css"> 
</head>
```

Браузер, читая html документ подгрузит стили из этого файла.

Также есть возможность задать стиль для элемента напрямую через атрибут style, но делать так не рекомендуется:

```html
<button style="margin-right: 5px; backgroud: red;">Красная кнопка</button>
```

## Стилизация верстки калькулятора с помощью CSS

Приступим к стилизации созданной ранее верстки калькулятора. Создайте css-файл и пропишите в нем стили для элементов калькулятора: кнопок и окна вывода.

```css

/* опишем базовый стиль кнопки калькулятора */
.my-btn { 
  margin-right: 5px;           /* задаем отступ от кнопки справа */
  margin-top: 5px;             /* задаем отступ от кнопки сверху*/
  width: 50px;                 /* задаем ширину кнопки */
  height: 50px;                /* задаем высоту кнопки */
  border-radius: 50%;          /* округляем кнопку */
  border: none;                /* отключаем обводку */
  background: #515151;         /* задаем серый цвет кнопки */
  color: white;                /* задаем белый цвет текста внутри кнопки */
  font-size: 1.5rem;           /* увеличим размер шрифта */
  font-family: Arial, Helvetica, sans-serif; /* сменим шрифт */
  cursor: pointer;             /* при наведении на кнопку курсор будет изменен
                                  со стрелки на 'указательный палец' */
  user-select: none;           /* отключаем возможность выделить текст внутри кнопки */
} 

/* hover - это состояние элемента, когда на него наведен курсор */
.my-btn:hover {
  background: darkgray; /* при наведение курсора на кнопку, она будет окрашена в серый */
}

/* active - это состояние активации элемента. В случае кнопки - нажатие на нее */
.my-btn:active {
  filter: brightness(130%); /* увеличим интенсивность цвета для эффекта вспышки */
}

/* селектор для кнопок первостепенных операций */
.my-btn.primary { 
  background: #ff9801; /* цвет кнопки оранжевый */
}

/* селектор для кнопок второстепенных операций */
.my-btn.secondary { 
  background: #a6a6a6; /* цвет кнопки сервый */
}

/* селектор для кнопки расчета выражения (=) */
.my-btn.execute { 
  width: 100px;          /* сделаем кнопку шире других */
  border-radius: 34px;   /* подкорректируем округлость */
}

/* селектор для поля вывода результата */
.result { 
  width: 220px;
  height: 50px;
  margin-bottom: 15px;         /* отступ снизу */
  padding-right: 10px;         /* выступ справа */
  background: rgb(73, 73, 73); /* цвет можно задавать и таким образом */
  text-align: right;           /* примагнитим текст к правой стороне */
  color: #ffffff;              /* цвет текста белый */
  font-size: 1.5rem;
  font-family: Arial, Helvetica, sans-serif;
}
```

Теперь заполним атрибут `class` у HTML-элементов калькулятора, чтобы применить к ним созданные стили:

1. Кнопки циферблата: 0-9 относятся к классу `my-btn`:
    
    ```html
    ...
    <button id="btn_7" class="my-btn">7</button>
    <button id="btn_8" class="my-btn">8</button>
    <button id="btn_9" class="my-btn">9</button>
    ...
    ```
    
2. Кнопки второстепенных операций (C, +/-, %) принадлежат классам `my-btn` и `secondary`:
    
    ```html
    ...
    <button id="btn_cancel" class="my-btn secondary">C</button>
    <button id="btn_sign" class="my-btn secondary">+/-</button>
    <button id="btn_percent" class="my-btn secondary">%</button>
    ...
    ```
    
3. Кнопки первостепенных операций принадлежат к классам `my-btn` и `primary`:
    
    ```html
    <button id="btn_mult" class="my-btn primary">x</button>
    ...
    <button id="btn_minus" class="my-btn primary">-</button>
    ...
    <button id="btn_plus" class="my-btn primary">+</button>
    ```
    
4. Кнопка “=” дополнительно относится еще и к классу `execute`:
    
    ```html
    <button id="btn_equal" class="my-btn primary execute">=</button>
    ```
    
5. Блок с экраном калькулятора относим к классу `result`:
    
    ```html
    <div id="result" class="result">
    	0
    </div>
    ```
    

Если все выполнено верно, изображение страницы должно соответствовать требуемому. Весь код можно найти в конце методички.

# Программирование логики с помощью JavaScript

Язык программирования JavaScript служит основным инструментом для описания логики и интерактивности веб-страниц. В данной работе с помощью Js мы будем программировать кнопки калькулятора.

Как и CSS, js-скрипт можно задать в самом HTML-документе (вложенный скрипт), либо вынести в отдельный файл и сослаться на него в HTML-файле:

```html
<head> 
  <title>калькулятор</title>
  <link rel="stylesheet" href="style.css"> 
  <script type="text/javascript" src="script.js"></script> 
</head>
```

### Доступ к HTML-элементам из JavaScript

Самый распространенный путь доступа к HTML-элементам из скрипта - получение HTML-объекта по его идентификатору. Для этого существует метод `getElementById`:

```html
<body>
	<p id="paragraph">Lorem Ipsum</p>

	<!--вложенный JS-скрипт-->
	<script>
		<!-- обращаемся к HTML-документу и ищем объект с id=paragraph -->
		element = document.getElementById("paragraph")

		<!-- через свойство innerHTML у полученного объекта можно изменить его содержимое-->
		element.innerHTML = "Измененный текст параграфа";
	</script>
</body>
```

Также JS предоставляет и другие методы получения элементов:

```jsx
document.getElementsByTagName(name) // поиск элементов по тэгу
document.getElementsByClassName(name) // поиск элементов определенного css класса
```

про другие способы взаимодействия с HTML-элементами из JS можно почитать [здесь](https://www.w3schools.com/js/js_htmldom.asp).

### Программирование кнопок калькулятора

```python
// файл script.js

let a = ''
let b = ''
let expressionResult = ''
let selectedOperation = null

// окно вывода результата
outputElement = document.getElementById("result")

// список объектов кнопок циферблата (id которых начинается с btn_digit_)
digitButtons = document.querySelectorAll('[id ^= "btn_digit_"]')

function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
        if ((digit != '.') || (digit == '.' && !a.includes(digit))) { 
            a += digit
        }
        outputElement.innerHTML = a
    } else {
        if ((digit != '.') || (digit == '.' && !b.includes(digit))) { 
            b += digit
            outputElement.innerHTML = b        
        }
    }
}

// устанавка колбек-функций на кнопки циферблата по событию нажатия
digitButtons.forEach(button => {
    button.onclick = function() {
        const digitValue = button.innerHTML
        onDigitButtonClicked(digitValue)
    }
});

// установка колбек-функций для кнопок операций
document.getElementById("btn_op_mult").onclick = function() { 
    if (a === '') return
    selectedOperation = 'x'
}
document.getElementById("btn_op_plus").onclick = function() { 
    if (a === '') return
    selectedOperation = '+'
}
document.getElementById("btn_op_minus").onclick = function() { 
    if (a === '') return
    selectedOperation = '-'
}
document.getElementById("btn_op_div").onclick = function() { 
    if (a === '') return
    selectedOperation = '/'
}

// кнопка очищения
document.getElementById("btn_op_clear").onclick = function() { 
    a = ''
    b = ''
    selectedOperation = ''
    expressionResult = ''
    outputElement.innerHTML = 0
}

// кнопка расчёта результата
document.getElementById("btn_op_equal").onclick = function() { 
    if (a === '' || b === '' || !selectedOperation)
        return
        
    switch(selectedOperation) { 
        case 'x':
            expressionResult = (+a) * (+b)
            break;
        case '+':
            expressionResult = (+a) + (+b)
            break;
        case '-':
            expressionResult = (+a) - (+b)
            break;
        case '/':
            expressionResult = (+a) / (+b)
            break;
    }
    
    a = expressionResult.toString()
    b = ''
    selectedOperation = null

    outputElement.innerHTML = a
}
```

# Задание

Вариант = (№ в списке % 3) + 1

1. Запрограммируйте операцию смены знака +/-, поменяйте цветовую палитру калькулятора с оранжево-серой на любую другую;
2. Запрограммируйте операцию вычисления процента %, сделайте фон калькулятора темным (наподобие ночной темы);
3. Добавьте кнопку стирания введенной цифры назад (backspace), сделайте кнопки квадратными вместо круглых. Расположить кнопку можно, например, на месте нерабочих +/- и % кнопок.