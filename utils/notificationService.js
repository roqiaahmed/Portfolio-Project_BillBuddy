const socketIo = require('socket.io');

let io;
const getUserId = (userId) => {
  return userId;
};

function initialize(server) {
  io = socketIo(server, {
    connectionStateRecovery: true, // Enable connection state recovery
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for user authentication
    socket.on('authenticate', (userId) => {
      // Associate the user ID with the client's socket ID
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}

function sendNotification(userId, message) {
  if (io) {
    io.to(userId).emit('reminder', { message });
  } else {
    console.error('Socket not found for user ID:', userId);
  }
}

module.exports = { initialize, sendNotification, getUserId };
