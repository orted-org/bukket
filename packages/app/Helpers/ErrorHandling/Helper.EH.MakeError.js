const makeError = require("http-errors");
function coatError(err) {
  if (err.status)
    return err;
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    return makeError.Unauthorized();
  return makeError.InternalServerError();
}

module.exports = { makeError, coatError };
