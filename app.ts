const express = require('express')
const app = express()
const port : number = 8000
const events = require('./events.json')


let serverStartTime : number = Date.now()

function formatTime(number: number | string) : string{
    return (number = number < 10 ? `0${number}` : `${number}`)
}

app.use(function(req, res, next) {
    let requestTime : number = Date.now()
    let currentTime : number = (requestTime - serverStartTime) / 1000
    let seconds : number = parseInt((currentTime % 60).toString())
    let minutes : number = parseInt(((currentTime / 60) % 60).toString())
    let hours : number = parseInt(((currentTime / 3600) % 24).toString())
    let currentTimeFormatted : string = `${formatTime(hours)}:${formatTime(
        minutes
    )}:${formatTime(seconds)}`

    if (req.url == '/status') {
        res.send(`${currentTimeFormatted}`)   
    } else {
        next()
    }
})

// Массив с корректными типами событий для запроса

let valid_events_types : string[] = ['critical', 'info']

//  По типу, переданному в запросе, выдаем либо все, либо отфильтрованные события

function sendEvents(res : Response, type : string) : void {
    const input : {} = events
    if (!type) {
        res.send(input)
        return
    }
    const types : string[] = type.split(':')

    if (types.some(item => valid_events_types.indexOf(item) == -1)) {
        res.send(400, 'Incorrect type')
    } else {
        let filteredEvents : string[] = input.events.filter(
            event => types.indexOf(event.type) != -1
        )
        res.send(filteredEvents)
    }
}

app.get('/api/events', (req, res) => {
    const type : string = req.query.type
    sendEvents(res, type)
})

app.post('/api/events', (req, res) => {
    const type : string = req.body.type
    sendEvents(res, type)
})

app.use(function(req, res) {
    res.status(404).send('Page Not Found')
})

app.listen(port, () => console.log(`Server is listening on port ${port}.`))

