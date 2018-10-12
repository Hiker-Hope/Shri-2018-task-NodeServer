    const express = require('express')
    const app = express()
    const port = 8000
    const events = require('./events.json')

    // filter events for readability

    const eventsInfo = events.events.filter(item => item.type == 'info')
    const eventsCritical = events.events.filter(item => item.type == 'critical')
    const serverStartTime = Date.now()

    function formatTime(number) {
        return number = number < 10 
                ? `0${number}`
                : `${number}`
    }

    app.use(function(req, res, next) {

        let requestTime = Date.now()
        let currentTime = (requestTime - serverStartTime) / 1000
        let seconds = parseInt(currentTime % 60)
        let minutes = parseInt(currentTime / 60 % 60)
        let hours = parseInt(currentTime / 60 / 60 % 24) 
        let currentTimeFormatted = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`

        if (req.url == '/status') {
            res.send(`${currentTimeFormatted}`)
        } else {
            next()
        }
    })


    // Костыли на случай запроса обоих типов событий одновременно т__т 
    // нужно разобраться с условиями в передаваемых параметрах для роутов

    app.use(function(req, res, next) {
        if (req.url == '/api/events' || req.url == '/api/events?type=critical:info' || req.url == '/api/events?type=info:critical') {
            res.send(events.events)
        } else if (req.url == `/api/events?type=info`) {
            res.send(eventsInfo)
        } else if (req.url == '/api/events?type=critical') {
            res.send(eventsCritical)
        } else {
            next()
        }
    })

    app.use(function(req, res) {
        res.send(404, 'Page Not Found')
    })

    app.listen(port, () => console.log(`Server is listening on port ${port}.`))