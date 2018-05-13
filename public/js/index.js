/* global io, moment, Handlebars */

const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const source = document.getElementById('message-template').innerHTML;
  const template = Handlebars.compile(source);
  const html = template({
    text: message.text,
    from: message.from,
    createdAt: formattedTime,
  });

  document.getElementById('messages').insertAdjacentHTML('beforeend', html);
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const source = document.getElementById('location-message-template').innerHTML;
  const template = Handlebars.compile(source);
  const html = template({
    url: message.url,
    from: message.from,
    createdAt: formattedTime,
  });

  document.getElementById('messages').insertAdjacentHTML('beforeend', html);
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const messageTextbox = e.target.message;

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.value,
    },
    function () {
      messageTextbox.value = '';
    },
  );
});

const locationButton = document.getElementById('send-location');

locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.setAttribute('disabled', 'disabled');
  locationButton.innerText = 'Sending location...';

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locationButton.removeAttribute('disabled');
      locationButton.innerText = 'Send location';

      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    function () {
      locationButton.removeAttribute('disabled');

      alert('Unable to fetch location.');
    },
  );

  return undefined;
});
