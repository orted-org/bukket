const express = require("express");
const router = express.Router();

const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");

const {
  getHome,
  validateGetHome,
} = require("../Controllers/Bucket/Controller.Bucket.home");

const {
  PostCreateBucket,
  getCreateBucket,
  createBucketValidator,
} = require("../Controllers/Bucket/Controller.Bucket.create");
const {
  PostDeleteBucket,
  validateDeleteBucket,
} = require("../Controllers/Bucket/Controller.Bucket.delete");
const {
  validateGetBucketPage,
  getBucketPage,
} = require("../Controllers/Bucket/Controller.Bucket.BucketPage");

//http://bukket.cloud

// this route is for getting buckets of the user
router.get("/", checkAllowance, validateGetHome, getHome);

// this route is for getting the particular bucket
router.get("/bucket", checkAllowance, validateGetBucketPage, getBucketPage);

// this route is for creating new bucket
router.post("/create", checkAllowance, createBucketValidator, PostCreateBucket);

router.delete(
  "/delete",
  checkAllowance,
  validateDeleteBucket,
  PostDeleteBucket
);

module.exports = router;
