const path = require("path")
const hhtp = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require("../src/utils/users")

const app = express()
const server = hhtp.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, "../public")

app.use(express.static(publicDirPath))

io.on("connection", (socket) => {
	console.log("Websocket connection")

	// socket emits to one connection
	socket.emit("message", generateMessage('Admin', "Welcome!"))

	// io.to.emit: emit events in specific room
	socket.on("join", ({ username, room }, callback) => {

        const {error, user } = addUser({id: socket.id, username, room})
		
        if ( error ) return callback(error)

        socket.join(user.room)

		// broadcast.to: send to all clients in one room, except det user
		socket.broadcast
			.to(user.room)
			.emit("message", generateMessage('Admin', `${user.username} has joined the room`))
    
        io.to(user.room).emit('roomData', { 
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
	})

	socket.on("sendMsg", (message, callback) => {
		const filter = new Filter()

		if (filter.isProfane(message)) return callback("Profanity is not allowed")

        const user = getUser(socket.id)
		// io emits to EVERY connected client in same room io.to(room)
		io.to(user.room).emit("message", generateMessage(user.username, message))
		callback()
	})

	// emits a separate event: locationMessage
	socket.on("sendLocation", (location, callback) => {
        const { username, room } = getUser(socket.id)
		io.to(room).emit(
			"locationMessage",
			generateLocationMessage(
                username,
				`https://google.com/maps?q=${location.latitude},${location.longitude}`
			)
		)
		callback("Location shared!")
	})

	socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.emit("message", `${user.username} has left the chat`)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
		
	})
})

server.listen(port, () => {
	console.log("Server is up on port ", port)
})
