const path = require("path")
const hhtp = require("http")
const express = require("express")
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage, generateLocationMessage } = require("./utils/messages")

const app = express()
const server = hhtp.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirPath = path.join(__dirname, "../public")

app.use(express.static(publicDirPath))

io.on("connection", (socket) => {
	console.log("Websocket connection")

	// socket emits to one connection
	socket.emit("message", generateMessage("Welcome!"))

	// broadcast: send to all clients except det connection
	socket.broadcast.emit(
		"message",
		generateMessage("A new user has joined the chat")
	)

	socket.on("sendMsg", (message, callback) => {
		const filter = new Filter()

		if (filter.isProfane(message)) return callback("Profanity is not allowed")

		// io emits to EVERY connected client
		io.emit("message", generateMessage(message))
		callback()
	})

	// emits a separate event: locationMessage
	socket.on("sendLocation", (location, callback) => {
		io.emit(
			"locationMessage",
			generateLocationMessage(
				`https://google.com/maps?q=${location.latitude},${location.longitude}`
			)
		)
		callback("Location shared!")
	})

	socket.on("disconnect", () => {
		io.emit("message", "A user has left the chat")
	})
})

server.listen(port, () => {
	console.log("Server is up on port ", port)
})
