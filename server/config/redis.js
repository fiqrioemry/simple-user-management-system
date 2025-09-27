require("dotenv").config();
const Redis = require("ioredis");

// get env variables
const { REDIS_PORT, REDIS_HOST, REDIS_PASSWORD } = process.env;

// setup redis connection
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

// debugging connection
redis.on("connect", () => {
  console.log("Connected to Redis on port :", REDIS_PORT);
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
