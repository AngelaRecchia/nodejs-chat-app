const socket = io()

socket.on('message', (msg) => {
    console.log(msg);
})

const form = document.querySelector('form')
form.onsubmit = (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg
    socket.emit('sendMsg', msg.value)
    msg.value = '' 
}

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Geolocation not supported by your browser')

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        socket.emit('sendLocation', {latitude, longitude})
    })
})
