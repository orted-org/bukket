const {
  makeError,
  coatError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");

const { authorizeRequest } = require("../../Models/Auth/AuthorizeRequest");
const {
  ACCESS_TOKEN_DURATION,
  REFRESH_TOKEN_DURATION,
} = require("../../Helpers/Auth/DurationHandler");

function checkAllowance(req, res, next) {
  if (req.cookies === undefined) {
    // checking if there is no cookie
    return res.render("index");
  } else if (
    // checking if there is no refresh token
    req.cookies._DOC_ID === undefined ||
    req.cookies._DOC_ID === "" ||
    req.cookies._DOC_ID === null
  ) {
    if (
      //checking if there is no access token also
      req.cookies._LOC_ID === undefined ||
      req.cookies._LOC_ID === "" ||
      req.cookies._LOC_ID === null
    ) {
      //means not logged and you come to "/" then render the landing page
      if (req.url == "/") {
        res.status(401).render("Auth/login", {
          clientSecret: process.env.GOOGLE_CLIENT_ID,
          nonce: res.locals.cspNonce,
        });
        return;
      }
      return next(makeError.Unauthorized());
    }
  }

  authorizeRequest({
    accessToken: req.cookies._LOC_ID,
    refreshToken: req.cookies._DOC_ID,
  })
    .then((data) => {
      if (data.status === 301) {
        // refreshed the tokens
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
      }
      //setting the user data to req object
      req.userData = data.payload;
      // allowing to next middleware
      next();
    })
    .catch((err) => {
      // not authorized
      next(coatError(err));
    });
}

module.exports = { checkAllowance };
