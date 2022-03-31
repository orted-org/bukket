const { ObjectId } = require("mongodb");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const { manageRequests } = require("../../Models/Requests/RequestsOperations");

function PostManageRequests(req, res, next) {
  const userId = req.userData.aud;
  const requestsData = req.body;

  manageRequests(userId, requestsData)
    .then((acknowledgement) => {
      res.status(acknowledgement.status).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateManageRequest(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);

    if (data.addedMembers == undefined || data.rejectedMembers == undefined) {
      return next(makeError(422, "Invalid inputs"));
    }

    let flag = true;

    data.addedMembers.forEach((element) => {
      if (!isMongoId(element)) flag = false;
    });
    data.rejectedMembers.forEach((element) => {
      if (!isMongoId(element)) flag = false;
    });

    if (!(isMongoId(data.bucketId) && flag)) {
      return next(makeError(422, "Invalid inputs"));
    }
    data.addedMembers = data.addedMembers.map(ObjectId);
    data.rejectedMembers = data.rejectedMembers.map(ObjectId);

    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  PostManageRequests,
  validateManageRequest,
};
