const express = require('express')
const app = express()
const port = 8000
const events = require('./events.json')

// filter events for readability

const eventsInfo = events.events.filter(item => item.type == 'info')
const eventsCritical = events.events.filter(item => item.type == 'critical')
const serverStartTime = Date.now()

function formatTime(number) {
    return (number = number < 10 ? `0${number}` : `${number}`)
}

app.use(function(req, res, next) {
    let requestTime = Date.now()
    let currentTime = (requestTime - serverStartTime) / 1000
    let seconds = parseInt(currentTime % 60)
    let minutes = parseInt((currentTime / 60) % 60)
    let hours = parseInt((currentTime / 3600) % 24)
    let currentTimeFormatted = `${formatTime(hours)}:${formatTime(
        minutes
    )}:${formatTime(seconds)}`

    if (req.url == '/status') {
        res.send(`${currentTimeFormatted}`)
    } else {
        next()
    }
})

// Массив с корректными типами событий для запроса

const VALID_EVENT_TYPES = ['critical', 'info']

//  По типу переданному в запросе выдаем либо все, либо отфильтрованные события

const sendEvents = (res, type) => {
    const input = events
    if (!type) {
        res.send(input)
        return
    }
    const types = type.split(':')

    if (types.some(e => VALID_EVENT_TYPES.indexOf(e) == -1)) {
        res.status(400).send('Incorrect type')
    } else {
        input.events = input.events.filter(
            event => types.indexOf(event.type) != -1
        )
        res.send(input)
    }
}

app.get('/api/events', (req, res) => {
    const type = req.query.type
    sendEvents(res, type)
})

app.post('/api/events', (req, res) => {
    const type = req.body.type
    sendEvents(res, type)
})

app.use(function(req, res) {
    res.send(404, 'Page Not Found')
})

app.listen(port, () => console.log(`Server is listening on port ${port}.`))
