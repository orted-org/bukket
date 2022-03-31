const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const { makeJoinRequest } = require("../../Models/Requests/RequestsOperations");

function PostJoinRequest(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.body.bucketId;

  makeJoinRequest(userId, bucketId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      //case 1. internal server error(500)
      //case 2. 404, no such bucket exists
      //case 3. 409 , conflicts, he is already part of the bucket
      next(err);
    });
}

function validatePostJoinRequest(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    if (!isMongoId(data.bucketId)) {
      return next(makeError(422, "Invalid inputs"));
    }
    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostJoinRequest,
  validatePostJoinRequest,
};
