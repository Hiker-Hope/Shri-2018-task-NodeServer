const express = require('express')
const app = express()
const port = 8000
const events = require('./events.json')

const eventsAll = events.events.map(item => item)
const eventsInfo = events.events.filter(item => item.type == 'info')
const eventsCritical = events.events.filter(item => item.type == 'critical')


const serverStart = Date.now()


app.use(function(req, res, next) {
    let requestTime = Date.now()

    let currentTime = (requestTime - serverStart) / 1000

    let seconds = parseInt(currentTime % 60)
    seconds = seconds < 10  
            ? `0${seconds}`
            : `${seconds}`
    let minutes = parseInt(currentTime / 60 % 60)
    minutes = minutes < 10 
            ? `0${minutes}`
            : `${minutes}`
    let hours = parseInt(currentTime / 60 / 60 % 24) 
    hours = hours < 10 
            ? `0${hours}`
            : `${hours}`

    let currentTimeFormatted = `${hours}:${minutes}:${seconds}`

    if (req.url == '/status') {

        res.send(`${currentTimeFormatted}`)
    } else {
        next()
    }
})

app.use(function(req, res, next) {
    if (req.url == '/api/events') {
        res.send(eventsAll)
    } else {
        next()
    }
})

app.use(function(req, res, next) {
    if (req.url == '/api/events?type=info') {
        res.send(eventsInfo)
    } else {
        next()
    }
})

app.use(function(req, res, next) {
    if (req.url == '/api/events?type=critical') {
        res.send(eventsCritical)
    } else {
        next()
    }
})

app.use(function(req, res) {
    res.send(404, 'Page Not Found')
})

app.listen(port, () => console.log(`Server is listening on port ${port}.`))