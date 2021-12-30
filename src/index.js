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

io.on('connection', (socket) => {
    console.log('Websocket connection')

    // socket emits to one connection
    socket.emit('message', 'Welcome')

    // broadcast: send to all clients except det connection
    socket.broadcast.emit('message', 'A new user has joined the chat')

    socket.on('sendMsg', (msg) => {
        // io emits to EVERY connected client
        io.emit('message', msg)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})

server.listen(port, () =>  {
    console.log('Server is up on port ', port)
})