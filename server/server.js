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
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.');
    } else {
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room);

      io.to(params.room).emit('updateUserList', users.getUserList(params.room));
      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

      socket.broadcast
        .to(params.room)
        .emit('newMessage', generateMessage('Admin', `${params.name} joined the chat`));
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
