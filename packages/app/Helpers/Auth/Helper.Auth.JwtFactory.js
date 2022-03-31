const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} = require("./DurationHandler");

function createToken(payload, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
function signAccessToken(audienceData) {
  const payload = {
    firstName: audienceData.firstName,
    lastName: audienceData.lastName,
    email: audienceData.email,
    profilePictureUrl: audienceData.profilePictureUrl,
  };
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const options = {
    expiresIn: ACCESS_TOKEN_DURATION.secFormat,
    issuer: "bukket.cloud",
    audience: audienceData.id,
  };
  return createToken(payload, secret, options);
}
async function signRefreshToken(audienceData) {
  const payload = {
    firstName: audienceData.firstName,
    lastName: audienceData.lastName,
    email: audienceData.email,
    profilePictureUrl: audienceData.profilePictureUrl,
  };
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const options = {
    expiresIn: REFRESH_TOKEN_DURATION.secFormat,
    issuer: "bukket.cloud",
    audience: audienceData.id,
  };
  const token = await createToken(payload, secret, options);
  return token;
}

function verifyAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}

function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
}
module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
