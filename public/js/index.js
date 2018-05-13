/* global io */

const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('New Message', message);
  const li = document.createElement('li');
  li.innerText = `${message.from}: ${message.text}`;

  document.getElementById('messages').appendChild(li);
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: e.target.message.value,
    },
    function () {},
  );
});
