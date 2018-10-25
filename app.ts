const express = require('express')
import { Request, Response, NextFunction } from 'express'
const app = express()
const port = 8000
export interface EventItem {
    type: string
}
export interface Events {
    events: EventItem[]
}

const events: Events = require('./events.json')

const serverStartTime: number = Date.now()

function formatTime(number: number | string): string {
    return (number = number < 10 ? `0${number}` : `${number}`)
}

app.use(function(req: Request, res: Response, next: NextFunction) {
    const requestTime: number = Date.now()
    let currentTime: number = (requestTime - serverStartTime) / 1000
    let seconds: number = parseInt((currentTime % 60).toString())
    let minutes: number = parseInt(((currentTime / 60) % 60).toString())
    let hours: number = parseInt(((currentTime / 3600) % 24).toString())
    let currentTimeFormatted: string = `${formatTime(hours)}:${formatTime(
        minutes
    )}:${formatTime(seconds)}`

    if (req.url == '/status') {
        res.send(`${currentTimeFormatted}`)
    } else {
        next()
    }
})

// Массив с корректными типами событий для запроса

const valid_events_types: string[] = ['critical', 'info']

//  По типу, переданному в запросе, выдаем либо все, либо отфильтрованные события

function sendEvents(
    res: Response,
    type: typeof events.events[0]['type']
): void {
    if (!type) {
        res.send(events)
        return
    }
    const types: string[] = type.split(':')

    if (types.some(item => valid_events_types.indexOf(item) == -1)) {
        res.status(400).send('Incorrect type')
    } else {
        let filteredEvents = events.events.filter(
            event => types.indexOf(event.type) != -1
        )
        res.send(filteredEvents)
    }
}

app.get('/api/events', (req: Request, res: Response) => {
    const type: string = req.query.type
    sendEvents(res, type)
})

app.post('/api/events', (req: Request, res: Response) => {
    const type: string = req.body.type
    sendEvents(res, type)
})

app.use(function(req: Request, res: Response) {
    res.status(404).send('Page Not Found')
})

app.listen(port, () => console.log(`Server is listening on port ${port}.`))
