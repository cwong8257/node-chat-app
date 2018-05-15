/* global io, moment, Handlebars, deparam */

const socket = io();

function scrollToBottom() {
  // Selectors
  const messages = document.getElementById('messages');
  const newMessage = messages.lastElementChild;
  const prevMessage = newMessage.previousElementSibling;
  // Heights
  const clientHeight = messages.clientHeight;
  const scrollTop = messages.scrollTop;
  const scrollHeight = messages.scrollHeight;
  const newMessageHeight = newMessage.clientHeight;
  const lastMessageHeight = prevMessage && prevMessage.clientHeight;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

socket.on('connect', function () {
  const params = deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
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
  scrollToBottom();
});

socket.on('updateUserList', function (users) {
  const usersElem = document.getElementById('users');
  const ol = document.createElement('ol');

  users.forEach(function (user) {
    const li = document.createElement('li');
    li.innerText = user;
    ol.appendChild(li);
  });
  console.log(ol);

  if (usersElem.firstChild) {
    usersElem.firstChild.remove();
  }

  document.getElementById('users').appendChild(ol);
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
  scrollToBottom();
});

document.getElementById('message-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const messageTextbox = e.target.message;

  socket.emit('createMessage', messageTextbox.value, function () {
    messageTextbox.value = '';
  });
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
