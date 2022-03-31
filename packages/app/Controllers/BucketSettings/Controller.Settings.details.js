const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const {
  isMongoId,
  trim,
  checkLength,
} = require("../../Helpers/Validator/validator");
const {
  editDetails,
} = require("../../Models/BucketSettings/SettingsOperations");

function PostEditBucketDetails(req, res, next) {
  const userId = req.userData.aud;
  const newBucketData = req.body;

  editDetails(userId, newBucketData)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. NotAcceptable(406), when the limit exceeds
      //case 2. internal server error(500)
      next(err);
    });
}

function validateEditBucketDetails(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    data.bucketName = trim(data.bucketName);
    data.bucketDescription = trim(data.bucketDescription);

    if (
      !(
        isMongoId(data.bucketId) &&
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
      return next(makeError(422, "Invalid inputs"));
    }

    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostEditBucketDetails,
  validateEditBucketDetails,
};
