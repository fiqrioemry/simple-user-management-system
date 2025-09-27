require("dotenv").config();
const cors = require("cors");
const express = require("express");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const limiter = require("./middleware/limiter");
const { errorHandler, notFoundHandler } = require("./middleware/errors");

const CLIENT_HOST = process.env.CLIENT_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

// init server
const app = express();
const server = require("http").createServer(app);

// set up limiter globaly
app.use(limiter);

// set parser to allow http cookie
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: CLIENT_HOST,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    maxAge: 86400, // set max age to 1 day
  })
);

// init route configuration
initRoutes(app);

// error handler middleware, it will throw all errro here
app.use(notFoundHandler);
app.use(errorHandler);

server.listen(SERVER_PORT, async () => {
  console.log(`Connected to server on port ${SERVER_PORT}`);
});
