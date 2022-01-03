const users = []

// add a new user
const addUser = ({ id, username, room }) => {
	// sanitize data
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()

	// validate
	if (!username || !room) return { error: "Username and room are required" }

	// check existing user
	const existingUser = users.find(
		(user) => user.room === room && user.username === username
	)
	if (existingUser) return { error: "Username is in use" }

	// store user
	const user = { id, username, room }
	users.push(user)
	return { user }
}

// removes a user: stop tracking
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if ( index !== -1) return users.splice( index, 1)[0]
}

// get user: fetch existing user data
const getUser = (id) => {
    return users.find(user => user.id === id)
}
// get users in a specific room
const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room.trim().toLowerCase())
    
}

module.exports = { 
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
