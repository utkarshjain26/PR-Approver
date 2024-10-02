const { Server } = require("socket.io");

let io = null;
let onlineUsers = {}; // key is userId, value is socket.id

const socketConnection = (server) => {
  io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origin: "http://localhost:3000",
    },
    credentials: "include",
    methods: ["GET", "POST"],
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log(`User ${userId} connected with socket id ${socket.id}`);
    });

    console.log("object", onlineUsers);

    socket.on("disconnect", () => {
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId];
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

const isUserOnline = (userId) => {
  return onlineUsers.hasOwnProperty(userId);
};

const sendNotificationToUser = (userId, message) => {
  const socketId = onlineUsers[userId];
  if (socketId && io) {
    io.to(socketId).emit("notification", message);
  }
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = {
  socketConnection,
  isUserOnline,
  sendNotificationToUser,
  getIo,
};
