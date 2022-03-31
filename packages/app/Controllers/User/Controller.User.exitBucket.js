const { exitBucket } = require("../../Models/User/UserOperations");
const { ObjectId } = require("mongodb");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");

function PostExitBucket(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.body.bucketId;
  const removedUsers = req.body.removedUsers;

  exitBucket(userId, bucketId, removedUsers)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      next(err);
    });
}

function validatePostExitBucket(req, res, next) {
  try {
    let data = req.body;
    const userId = req.userData.aud;
    data.bucketId = trim(data.bucketId);

    if (!isMongoId(data.bucketId)) {
      return next(makeError(422, "Invalid inputs"));
    }

    data.removedUsers = [ObjectId(userId)];
    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostExitBucket,
  validatePostExitBucket,
};
