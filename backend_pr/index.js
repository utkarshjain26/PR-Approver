require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 4000;
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const server = require("http").createServer(app);

const User = require("./model/user");
const Review = require("./model/review");
const PullRequest = require("./model/pullrequest");
const Approval = require("./model/approval");
const { appRouter } = require("./modules/index.routes");
const { authRouter } = require("./modules/Auth/auth.routes");
const { requestRouter } = require("./modules/Request/request.routes");
const { userRouter } = require("./modules/User/user.routes");
const { verifyToken } = require("./middleware/verifyToken");


const { socketConnection } = require("./socket/socketHandler");

socketConnection(server);

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/", appRouter);


// global error handler
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    // logger.log(error);
    console.log(error);
  }
  let message = null;
  let status = 500;
  if (error.errors) {
    const ve = error;
    ve.message = "Validation Error";
    return res.status(400).send(ve);
  }
  if (error instanceof Object) {
    if (error.message && error.status && error) {
      message = {
        message: error.message,
        // stack: stringifyError(error),
      };
      status = error.status;
    } else
      message = {
        message: "Internal Server Error",
        // stack: stringifyError(error),
      };
  } else if (typeof error === "string" && !error.includes("Error")) {
    message = {
      message: error,
    };
  } else {
    message = {
      message: "Internal Server Error",
      // stack: stringifyError(error),
    };
  }
  return res.status(status).send(message);
});

mongoose.connection.once("open", () => {
  server.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
  });
  console.log(`connected to DB`);
});
