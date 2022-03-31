const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { isMongoId, trim } = require("../../Helpers/Validator/validator");
const { deleteBucket } = require("../../Models/Bucket/BucketOperations");

function PostDeleteBucket(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.body.bucketId;

  deleteBucket(userId, bucketId)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateDeleteBucket(req, res, next) {
  try {
    req.body.bucketId = trim(req.body.bucketId);
    if (!isMongoId(req.body.bucketId)) {
      return next(makeError(422, "Invalid inputs"));
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostDeleteBucket,
  validateDeleteBucket,
};
