const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minute
  max: 1000, // maximum 1000 request per 10 minute
  message: "Too many requests",
  headers: true,
});

module.exports = limiter;
