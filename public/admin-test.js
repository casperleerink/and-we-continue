const socket = io({transports: ['websocket']});

socket.on('connect', () => {
    socket.emit('adminConnected', "once-she-dries");
});


const startBtn = document.getElementById('start');
const partBtn = document.getElementById('partSubmit');

startBtn.addEventListener("click", () => {
    socket.emit('start');
});

partBtn.addEventListener('click', () => {
    const part = parseInt(document.getElementById('part').value);
    console.log(part);
    socket.emit("changePart", part);
})

document.getElementById('heat').addEventListener('change', () => {
    socket.emit('heat', parseFloat(document.getElementById('heat').value));
});

document.getElementById('gravity').addEventListener('change', () => {
    socket.emit('gravity', parseFloat(document.getElementById('gravity').value));
});