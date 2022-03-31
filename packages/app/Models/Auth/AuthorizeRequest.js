const { refreshExistingToken } = require("./LoginOperation");
const {
  verifyAccessToken,
} = require("../../Helpers/Auth/Helper.Auth.JwtFactory");

/*
This function checks if the user is logged in 
and is allowed to make a request to the server
and returns tokens if access token is expired 
and refresh token is refreshed successfully.
*/
function authorizeRequest(incomingTokens) {
  return new Promise(async (resolve, reject) => {
    return verifyAccessToken(incomingTokens.accessToken)
      .then((payload) => {
        return resolve({ payload });
      })
      .catch((err) => {
        refreshExistingToken(incomingTokens.refreshToken)
          .then((data) => {
            return resolve(data);
          })
          .catch((err) => {
            return reject(err);
          });
      });
  });
}

module.exports = { authorizeRequest };
