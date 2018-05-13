const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined the chat'));

  socket.on('createMessage', ({ from, text }, callback) => {
    io.emit('newMessage', generateMessage(from, text));
    callback('This is from the server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit(
      'newLocationMessage',
      generateLocationMessage('Admin', coords.latitude, coords.longitude),
    );
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
