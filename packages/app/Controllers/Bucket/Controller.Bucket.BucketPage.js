const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const {
  getAllBucketItemsOfBucket,
} = require("../../Models/Bucket/BucketOperations");

function getBucketPage(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.query.id;
  getAllBucketItemsOfBucket(userId, bucketId)
    .then((bucketPageData) => {
      //single object containing all bucket data;
      res.status(200).json(bucketPageData);
    })
    .catch((err) => {
      //1. forbidden(403), when user is not part of bucket;
      //2, internal server err
      next(err);
    });
}

function validateGetBucketPage(req, res, next) {
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
  getBucketPage,
  validateGetBucketPage,
};
