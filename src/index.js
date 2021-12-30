const path = require('path')
const hhtp = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = hhtp.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

let count = 0

io.on('connection', (socket) => {
    console.log('Websocket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++
        io.emit('countUpdated', count)
    })
})

server.listen(port, () =>  {
    console.log('Server is up on port ', port)
})