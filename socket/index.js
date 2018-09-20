'use strict';

var session = require('../session');
var userApi = require('../api').user;

var userSocketMap = {};

module.exports = (server) => {
  var socketIO = require('socket.io')(server)

  socketIO.set('transports', ['websocket']);

  socketIO.use((socket, next) => {
    session(socket.request, {}, next);
  });

  socketIO.on('connection', (socket) => {
    var userId

    if (socket.request.session.user) {
      userId = socket.request.session.user.id
      userSocketMap[userId] = socket.id;

      console.log('User connected id:', userId, 'socket id:',socket.id)
      
      var userList = Object.keys(userSocketMap);

      userApi.list({id: userList}, (err, userMap) => {
        if (!err && userMap) {
          var currentUserData = JSON.parse(JSON.stringify(userMap[userId]));
          socket.broadcast.emit('adduser', currentUserData);
          
          delete userMap[userId];
          socket.emit('userList', userMap)
        }
      });
    }

    socket.on('message', (data) => {
      var toUserId = data.to
      var targetSocketId = userSocketMap[toUserId] //TODO Can be array also

      socketIO.to(targetSocketId).emit('message', {from: userId, message: data.message})
    });

    socket.on('disconnect', () => {
      console.log('User disconnected id:', userId, 'socket id:', socket.id)
      delete userSocketMap[userId];

      socket.broadcast.emit('removeuser', userId);
    })
  });
};