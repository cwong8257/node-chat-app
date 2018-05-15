const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    if (!isRealString(name) || !isRealString(room)) {
      callback('Name and room name are required.');
    } else {
      const lowerCaseRoom = room.toLowerCase();
      socket.join(lowerCaseRoom);
      users.removeUser(socket.id);
      users.addUser(socket.id, name, lowerCaseRoom);

      io.to(lowerCaseRoom).emit('updateUserList', users.getUserList(lowerCaseRoom));
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

      socket.broadcast
        .to(lowerCaseRoom)
        .emit('newMessage', generateMessage('Admin', `${name} joined the chat`));

      callback();
    }
  });

  socket.on('createMessage', (text, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);

    io
      .to(user.room)
      .emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude),
      );
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io
        .to(user.room)
        .emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
