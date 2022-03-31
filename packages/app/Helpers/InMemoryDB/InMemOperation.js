const redisClient = require("../Helper.RedisInit");

function inMemSet(key, value, expiryTime) {
  return new Promise((resolve, reject) => {
    redisClient.SET(key, value, "EX", expiryTime, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  });
}

function inMemGet(key) {
  return new Promise((resolve, reject) => {
    redisClient.GET(key, (err, reply) => {
      if (err) return reject(err);
      return resolve(reply);
    });
  });
}

function inMemDel(key) {
  return new Promise((resolve, reject) => {
    redisClient.DEL(key, (err, reply) => {
      if (err) return reject(err);
      return resolve(reply);
    });
  });
}

module.exports = { inMemSet, inMemGet, inMemDel };
