const socket = io();


document.getElementById('spotify-play').addEventListener('click', () => {
  socket.emit('spotify:resume');
});

document.getElementById('spotify-pause').addEventListener('click', () => {
  socket.emit('spotify:pause');
});


document.getElementById('soundcloud-play').addEventListener('click', () => {
  socket.emit('soundcloud:play');
});

document.getElementById('soundcloud-pause').addEventListener('click', () => {
  socket.emit('soundcloud:pause');
});

document.getElementById('soundcloud-skip').addEventListener('click', () => {
  socket.emit('soundcloud:skip');
});

document.getElementById('soundcloud-prev').addEventListener('click', () => {
  socket.emit('soundcloud:prev');
});
