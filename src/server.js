const express = require("express");
const app = express();
const connection = require("./config/database");
const router = require("./router/router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require('http').Server(app);
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = 5000;

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "50mb",
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
});

router(app);

connection.connect((err, result) => {
  err
    ? console.log("kết nối database thất bại")
    : console.log("kết nối database thành công");
});

app.listen(port, () => {
  console.log(`backend api listening on port ${port}`);
});
