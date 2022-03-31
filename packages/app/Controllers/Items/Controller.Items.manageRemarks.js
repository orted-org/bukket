const { ObjectId } = require("mongodb");
const { PROPS } = require("../../Helpers/DataAccess/DBInfo");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const {
  isMongoId,
  trim,
  checkLength,
} = require("../../Helpers/Validator/validator");
const { manageRemarks } = require("../../Models/Items/ItemsOperations");

function PostManageRemarks(req, res, next) {
  const userId = req.userData.aud;
  const remarkData = req.body;

  manageRemarks(userId, remarkData)
    .then((acknowledgement) => {
      res.status(200).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateManageRemark(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    data.bucketItemId = trim(data.bucketItemId);
    data.text = trim(data.text);

    if (
      !(
        isMongoId(data.bucketId) &&
        isMongoId(data.bucketItemId) &&
        checkLength(
          data.text,
          PROPS.limits.minRemarkLen,
          PROPS.limits.maxRemarkLen
        )
      )
    ) {
      return next(makeError(422, "Invalid inputs"));
    }

    data.bucketId = ObjectId(data.bucketId);
    data.bucketItemId = ObjectId(data.bucketItemId);
    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostManageRemarks,
  validateManageRemark,
};
