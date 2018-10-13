# Задание №4 для ШРИ 2018

## Тема: Node.js

## Запуск:

-   склонировать репозиторий: git clone https://github.com/Hiker-Hope/Shri-2018-task-NodeServer.git
-   npm i
-   node app.js
-   открыть в браузере:

1. localhost:8000/api/events - для просмотра всех событий
2. localhost:8000/api/events?type=info - для обычных событий
3. localhost:8000/api/events?type=critical - для критический событий
4. localhost:8000/status - для просмотра времени, прошедшего с запуска сервера

Код находится в файле **app.js**

### TODO

-   вынести фильтр событий в отдельную функцию
-   разобраться с роутингом (параметры, модули)
