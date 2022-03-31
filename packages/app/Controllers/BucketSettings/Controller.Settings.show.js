const {
  makeError,
} = require("../../Helpers/ErrorHandling/Helper.EH.MakeError");
const { trim, isMongoId } = require("../../Helpers/Validator/validator");
const {
  showDetails,
} = require("../../Models/BucketSettings/SettingsOperations");

function GetSettingsPage(req, res, next) {
  const userId = req.userData.aud;
  const bucketId = req.query.id;

  showDetails(userId, bucketId)
    .then((settingPageData) => {
      const userListData = settingPageData[0].members;
      res.status(200).json({ userList: userListData });
    })
    .catch((err) => {
      //case 1. forbidden(403), when user is not admin
      //case 2. internal server error(500)
      next(err);
    });
}

function validateGetSetting(req, res, next) {
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
  GetSettingsPage,
  validateGetSetting,
};
