const socket = io()

socket.on('countUpdated', (count) => {
    console.log('The count has been updated: ', count)
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('+1 clicked')
    socket.emit('increment')
})