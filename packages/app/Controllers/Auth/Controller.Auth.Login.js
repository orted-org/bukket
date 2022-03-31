const {
  verifyGoogleIdTokenAndGetUserData,
} = require("../../Helpers/Auth/Helper.Auth.GoogleAuthLib");
const {
  performLogin,
  checkIfAlreadyLogin,
} = require("../../Models/Auth/LoginOperation");
const {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} = require("../../Helpers/Auth/DurationHandler");

// controller to perform login when received ID token from Google Auth
// req.body.googleIdToken contains the google Auth ID token
function LoginPost(req, res, next) {
  //checking via refresh token if already logged in
  checkIfAlreadyLogin(req.cookies._DOC_ID)
    .then((payload) => {
      //already logged in and the payload gives the user information from jwt
      res.status(200).json({
        userData: payload,
      });
    })
    .catch((err) => {
      //this means not logged in
      verifyGoogleIdTokenAndGetUserData(req.body.googleIdToken)
        .then(async (userData) => {
          //calling the model function for login
          try {
            const data = await performLogin(userData);

            //login done and setting cookie
            //_LOC_ID = ACCESS TOKEN
            //_DOC_ID = REFRESH TOKEN
            res.cookie("_LOC_ID", data.accessToken, {
              maxAge: ACCESS_TOKEN_DURATION.msFormat,
              httpOnly: true,
              sameSite: "strict",
            });
            res.cookie("_DOC_ID", data.refreshToken, {
              maxAge: REFRESH_TOKEN_DURATION.msFormat,
              httpOnly: true,
              sameSite: "strict",
            });

            // sending the response
            res.status(200).json({ userData: data.userData });
          } catch (err) {
            //this will be internal server error
            throw err;
          }
        })
        .catch((err) => {
          //if google Id authentication fails
          res.status(401);
        });
    });
}
function LoginGet(req, res, next) {
  checkIfAlreadyLogin(req.cookies._DOC_ID)
    .then((payload) => {
      //already logged in and the payload gives the user information from jwt

      res.status(200).json({
        userData: payload,
      });
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = { LoginPost, LoginGet };
