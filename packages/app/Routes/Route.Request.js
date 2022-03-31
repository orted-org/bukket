const express = require("express");
const router = express.Router();

const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");

const {
  GetJoinRequests,
  validateGetJoinRequests,
} = require("../Controllers/Requests/Controller.Requests.joinRequests");

const {
  PostJoinRequest,
  validatePostJoinRequest,
} = require("../Controllers/Requests/Controller.Requests.postRequest");

const {
  PostManageRequests,
  validateManageRequest,
} = require("../Controllers/Requests/Controller.Requests.manageRequests");

//http://bukket.cloud/request
// this router expects bucketId from query
router.get("/", checkAllowance, validateGetJoinRequests, GetJoinRequests);

// this route expects an addedMembers array, rejectedMembers array and bucketId in the body
router.post(
  "/manage",
  checkAllowance,
  validateManageRequest,
  PostManageRequests
);

// this route is for taking requests and expects bucketId of the body to be joined
router.post("/join", checkAllowance, validatePostJoinRequest, PostJoinRequest);

module.exports = router;
