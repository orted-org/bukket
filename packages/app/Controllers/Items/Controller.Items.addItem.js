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
const { addItem } = require("../../Models/Items/ItemsOperations");

function PostAddItem(req, res, next) {
  const userId = req.userData.aud;
  const bucketItemData = req.body;

  addItem(userId, bucketItemData)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateAddItem(req, res, next) {
  try {
    req.body.bucketItemCreateDate = new Date().toDateString();
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    data.bucketItemName = trim(data.bucketItemName);
    data.bucketItemDescription = trim(data.bucketItemDescription);
    data.bucketItemLink = trim(data.bucketItemLink);
    data.bucketItemCreateDate = trim(data.bucketItemCreateDate);

    if (
      !(
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
  PostAddItem,
  validateAddItem,
};
