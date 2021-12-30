const socket = io()

// elements
const $msgForm = document.querySelector('form')
const $msgFormInput = document.querySelector('input')
const $msgFormButton = document.querySelector('button')
const $msgFormGeo = document.querySelector('#send-location')

socket.on('message', (msg) => {
    console.log(msg);
})

$msgForm.onsubmit = (e) => {
    e.preventDefault()

    $msgFormButton.setAttribute('disabled', 'disabled')
    const msg = e.target.elements.msg

    //3rd argument: acknowledgement -> changes to 
    socket.emit('sendMsg', msg.value, (error) => {
        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()

        if (error) return console.log(error)

        console.log('Message delivered!')

    })
}

$msgFormGeo.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Geolocation not supported by your browser')
    $msgFormGeo.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        $msgFormGeo.removeAttribute('disabled')
        const { latitude, longitude } = position.coords
        socket.emit('sendLocation', {latitude, longitude}, (message) =>  {
            console.log(message);
        })
    })
})
