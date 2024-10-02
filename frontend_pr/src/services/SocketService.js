const io = require('socket.io-client');

let socket;

export const initiateSocketConnection = (url, userId) => {
  socket = io.connect(url);
  console.log("Connecting socket...");
    
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    console.log(userId);
    // Register user with the backend
    socket.emit("registerUser", userId);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected.");
  }
};

export const subscribeToNotifications = (callback) => {
  if (!socket) return;
  socket.on("notification", (notification) => {
    callback(notification);
  });
};
