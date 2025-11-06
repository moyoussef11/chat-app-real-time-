const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { object } = require('joi');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

const userSocketOnline = {}; // { userId: socketId }

const getReceiverSocketId = (userId) => {
  return userSocketOnline[userId];
};

io.on('connection', (socket) => {
  // console.log(socket.handshake.query.userId);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketOnline[userId] = socket.id;
  }

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`✅ Socket ${socket.id} joined group ${groupId}`);
  });

  io.emit('getOnlineUsers', Object.keys(userSocketOnline));

  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
    delete userSocketOnline[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketOnline));
  });
});

module.exports = { app, server, io, getReceiverSocketId };
