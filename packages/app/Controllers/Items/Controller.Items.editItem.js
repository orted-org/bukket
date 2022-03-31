const { ObjectId } = require("mongodb");
const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const {
  trim,
  checkLength,
  isMongoId,
  isInt,
  isInRange,
} = require("../../Helpers/Validator/validator");
const { editItem } = require("../../Models/Items/ItemsOperations");

function PostEditItem(req, res, next) {
  const userId = req.userData.aud;
  const newBucketItemData = req.body;

  editItem(userId, newBucketItemData)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateEditItem(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    data.bucketItemId = trim(data.bucketItemId);
    data.bucketItemName = trim(data.bucketItemName);
    data.bucketItemDescription = trim(data.bucketItemDescription);
    data.bucketItemLink = trim(data.bucketItemLink);

    if (
      !(
        isMongoId(data.bucketItemId) &&
        isMongoId(data.bucketId) &&
        checkLength(
          data.bucketItemName,
          PROPS.limits.minNameLen,
          PROPS.limits.maxNameLen
        ) &&
        checkLength(
          data.bucketItemDescription,
          PROPS.limits.minDescLen,
          PROPS.limits.maxDescLen
        ) &&
        Array.isArray(data.bucketItemTag)
      )
    ) {
      return next(makeError(422, "Invalid inputs"));
    }
    data.bucketId = ObjectId(data.bucketId);
    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostEditItem,
  validateEditItem,
};
