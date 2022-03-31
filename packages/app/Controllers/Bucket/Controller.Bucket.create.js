const { ObjectId } = require("mongodb");
const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, checkLength } = require("../../Helpers/Validator/validator");
const { createBucket } = require("../../Models/Bucket/BucketOperations");

function PostCreateBucket(req, res, next) {
  const userId = req.userData.aud;
  const bucketData = req.body;

  createBucket(userId, bucketData)
    .then((bucketDataFromDb) => {
      //getting new bucket object
      res.status(201).json(bucketDataFromDb);
    })
    .catch((err) => {
      next(err);
    });
}

function createBucketValidator(req, res, next) {
  try {
    req.body.bucketCreateDate = new Date().toDateString();
    let data = req.body;
    data.bucketName = trim(data.bucketName);
    data.bucketCreateDate = trim(data.bucketCreateDate);
    data.bucketDescription = trim(data.bucketDescription);

    if (
      !(
        checkLength(
          data.bucketName,
          PROPS.limits.minNameLen,
          PROPS.limits.maxNameLen
        ) &&
        checkLength(
          data.bucketDescription,
          PROPS.limits.minDescLen,
          PROPS.limits.maxDescLen
        )
      )
    ) {
      return next(makeError(422, "Invalid string lengths"));
    }

    data.memberIds = [ObjectId(req.userData.aud)];
    data.bucketAdmins = [ObjectId(req.userData.aud)];

    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostCreateBucket,
  createBucketValidator,
};
