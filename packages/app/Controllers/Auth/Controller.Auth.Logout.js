const { performLogout } = require("../../Models/Auth/LoginOperation");
function Logout(req, res, next) {
  res.clearCookie("_DOC_ID");
  res.clearCookie("_LOC_ID");

  // sending the incoming refresh token for logout
  performLogout(req.cookies._DOC_ID, req.userData)
    .then(() => {
      //json because this request is made from internal js
      res.status(200).json({
        status: 200,
      });
    })
    .catch((err) => {
      //this will be internal server
      //json because this request is made from internal js
      res.status(500).json({
        status :500
      })
    });
}

module.exports = Logout;
