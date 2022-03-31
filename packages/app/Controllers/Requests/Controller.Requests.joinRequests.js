const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const { joinRequests } = require("../../Models/Requests/RequestsOperations");

function GetJoinRequests(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.query.id;

  joinRequests(userId, bucketId)
    .then((allRequests) => {
      const userListData = allRequests[0].joinRequests;
      res.status(200).json({ userList: userListData });
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateGetJoinRequests(req, res, next) {
  try {
    req.query.id = trim(req.query.id);
    if (!isMongoId(req.query.id)) {
      return next(makeError(422, "Invalid inputs"));
    }
    next();
  } catch (err) {
    next(err);
  }
}
module.exports = {
  GetJoinRequests,
  validateGetJoinRequests,
};
