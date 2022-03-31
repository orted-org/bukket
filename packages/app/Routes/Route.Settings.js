const express = require("express");
const router = express.Router();

const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");

const {
  PostEditBucketDetails,
  validateEditBucketDetails,
} = require("../Controllers/BucketSettings/Controller.Settings.details");
const {
  postManageUsers,
  validatePostManageUsers,
} = require("../Controllers/BucketSettings/Controller.Settings.manageUser");

const {
  GetSettingsPage,
  validateGetSetting,
} = require("../Controllers/BucketSettings/Controller.Settings.show");

//http://bukket.cloud/settings

// this route expects bucketId in query params
router.get("/", checkAllowance, validateGetSetting, GetSettingsPage);

//this route is for removing users and expects user ids of users to be removed
router.post(
  "/manage-user",
  checkAllowance,
  validatePostManageUsers,
  postManageUsers
);

//this route is for buckets details edit and expects the new edited bucket details
router.post(
  "/details",
  checkAllowance,
  validateEditBucketDetails,
  PostEditBucketDetails
);

module.exports = router;
