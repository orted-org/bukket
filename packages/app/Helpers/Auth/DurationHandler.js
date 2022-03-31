const ACCESS_TOKEN_DURATION = {
  msFormat: 1000 * 60 * 15,
  secFormat: 60 * 15,
};

const REFRESH_TOKEN_DURATION = {
  msFormat: 1000 * 60 * 60 * 24,
  secFormat: 60 * 60 * 24,
};

module.exports = { ACCESS_TOKEN_DURATION, REFRESH_TOKEN_DURATION };
