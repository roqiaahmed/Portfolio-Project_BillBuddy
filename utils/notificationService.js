const socketIo = require("socket.io");

let io;

function initialize(server) {
  io = socketIo(server);
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

function sendNotification(message) {
  console.log("Sending notification");
  if (io) {
    console.log("Sending message to client", message);
    io.emit("reminder", { message });
  } else {
    console.error("Socket.IO is not initialized.");
  }
}

module.exports = { initialize, sendNotification };
