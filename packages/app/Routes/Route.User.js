const express = require("express");
const router = express.Router();
const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");
const {
  validatePostExitBucket,
  PostExitBucket,
} = require("../Controllers/User/Controller.User.exitBucket");

router.post("/exit", checkAllowance, validatePostExitBucket, PostExitBucket);

module.exports = router;
