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

socket.on('newLocationMessage', function (message) {
  const li = document.createElement('li');
  const a = document.createElement('a');

  a.setAttribute('target', '_blank');
  a.setAttribute('href', message.url);
  a.innerText = 'My current location';
  li.innerText = `${message.from}: `;
  li.appendChild(a);

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

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      alert('Unable to fetch location.');
    },
  );

  return undefined;
});
