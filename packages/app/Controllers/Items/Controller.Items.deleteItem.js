const { ObjectId } = require("mongodb");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const { deleteItem } = require("../../Models/Items/ItemsOperations");

function DeleteItem(req, res, next) {
  const userId = req.userData.aud;
  const bucketItemData = req.body;

  deleteItem(userId, bucketItemData)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateDeleteItem(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);
    data.bucketItemId = trim(data.bucketItemId);

    if (!(isMongoId(data.bucketId) && isMongoId(data.bucketItemId))) {
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
  DeleteItem,
  validateDeleteItem,
};
