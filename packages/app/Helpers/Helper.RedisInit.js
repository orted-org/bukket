const redis = require("redis");

const redisClient = redis.createClient({
  host: process.env.REDIS_URI || "redis",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("connect", () => {
  console.log("Connected To Redis");
});

redisClient.on("error", (err) => {
  console.log(err.message);
});

redisClient.on("ready", () => {
  console.log("Redis ready to use");
});

redisClient.on("end", () => {
  console.log("Redis disconnected");
});

process.on("SIGINT", () => {
  redisClient.quit();
});

module.exports = redisClient;
