"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var port = 8000;
var events = require('./events.json');
var serverStartTime = Date.now();
function formatTime(number) {
    return (number = number < 10 ? "0" + number : "" + number);
}
app.use(function (req, res, next) {
    var requestTime = Date.now();
    var currentTime = (requestTime - serverStartTime) / 1000;
    var seconds = parseInt((currentTime % 60).toString());
    var minutes = parseInt(((currentTime / 60) % 60).toString());
    var hours = parseInt(((currentTime / 3600) % 24).toString());
    var currentTimeFormatted = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    if (req.url == '/status') {
        res.send("" + currentTimeFormatted);
    }
    else {
        next();
    }
});
// Массив с корректными типами событий для запроса
var valid_events_types = ['critical', 'info'];
//  По типу, переданному в запросе, выдаем либо все, либо отфильтрованные события
function sendEvents(res, type) {
    if (!type) {
        res.send(events);
        return;
    }
    var types = type.split(':');
    if (types.some(function (item) { return valid_events_types.indexOf(item) == -1; })) {
        res.status(400).send('Incorrect type');
    }
    else {
        var filteredEvents = events.events.filter(function (event) { return types.indexOf(event.type) != -1; });
        res.send(filteredEvents);
    }
}
app.get('/api/events', function (req, res) {
    var type = req.query.type;
    sendEvents(res, type);
});
app.post('/api/events', function (req, res) {
    var type = req.body.type;
    sendEvents(res, type);
});
app.use(function (req, res) {
    res.status(404).send('Page Not Found');
});
app.listen(port, function () { return console.log("Server is listening on port " + port + "."); });
