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
