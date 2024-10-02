// const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");

// let io = null;

// function init(server) {
//   io = new Server(server, {
//     connectionStateRecovery: {},
//     cors: {
//       origin: "http://localhost:3000",
//     },
//     credentials: "include",
//     methods: ["GET", "POST"],
//   });

//   io.use((socket, next) => {
//     const token = socket.handshake.query.token;
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) return next(new Error("Authentication error"));
//         socket.user = decoded; // Attaching user info to the socket for future use
//         next();
//       });
//     } else {
//       next(new Error("Authentication error"));
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.user.id}`);

//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.user.id}`);
//     });
//   });

//   io.emit("eventName", "Hi this is me from server");
//   return io;
// }

// function getIo() {
//   if (!io) {
//     throw new Error("Socket.io not initialized!");
//   }
//   return io;
// }

// module.exports = { init, getIo };
