const { response } = require("express");
const { ObjectId } = require("mongodb");
const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const {
  manageUsers,
} = require("../../Models/BucketSettings/SettingsOperations");

function postManageUsers(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.body.bucketId;
  const removedUsers = req.body.removedUsers;
  
  manageUsers(userId, bucketId, removedUsers)
    .then((acknowledgement) => {
      res.status(200).json(acknowledgement);
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validatePostManageUsers(req, res, next) {
  try {
    let data = req.body;
    data.bucketId = trim(data.bucketId);

    if (data.removedUsers == undefined) {
      return next(makeError(422, "Invalid inputs"));
    }
    if (data.removedUsers.length === 0) {
      return next(makeError(422, "Should contain at least 1 user"));
    }

    let flag = true;
    data.removedUsers.forEach((element) => {
      if (!isMongoId(element)) flag = false;
    });

    if (!(isMongoId(data.bucketId) && flag)) {
      return next(makeError(422, "Invalid inputs"));
    }

    data.removedUsers = data.removedUsers.map(ObjectId);

    req.body = data;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postManageUsers,
  validatePostManageUsers,
};
