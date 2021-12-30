const socket = io()

// elements
const $msgForm = document.querySelector('form')
const $msgFormInput = document.querySelector('input')
const $msgFormButton = document.querySelector('button')
const $msgFormGeo = document.querySelector('#send-location')
const $msgs = document.querySelector('#msgs')

// templates
const msgTemplate = document.querySelector('#msg-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// receive message
socket.on('message', (msg) => {
    console.log(msg);
    const html = Mustache.render(msgTemplate, {
        msg: msg.text,
        createdAt: moment(msg.createdAt).format('HH:mm')
    })
    $msgs.insertAdjacentHTML('afterend', html)
})

// receive location
socket.on('locationMessage', (msg) => {
    console.log(msg.url);
    const html = Mustache.render(locationTemplate, {
        url: msg.url,
        createdAt: moment(msg.createdAt).format('HH:mm')
    })
    $msgs.insertAdjacentHTML('afterend', html)
})

// send message
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
