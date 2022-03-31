const express = require("express");
const router = express.Router();

const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");

const {
  PostAddItem,
  validateAddItem,
} = require("../Controllers/Items/Controller.Items.addItem");

const {
  PostEditItem,
  validateEditItem,
} = require("../Controllers/Items/Controller.Items.editItem");

const {
  DeleteItem,
  validateDeleteItem,
} = require("../Controllers/Items/Controller.Items.deleteItem");

const {
  PostManageRemarks,
  validateManageRemark,
} = require("../Controllers/Items/Controller.Items.manageRemarks");

//http://bukket.cloud/item/

// expects all the details of an item-bucketItemTitle, bucketItemDesc, bucketItemTags, in the request body
router.post("/add", checkAllowance, validateAddItem, PostAddItem);

// expects the new details of the bucket item in the request body
router.post("/edit", checkAllowance, validateEditItem, PostEditItem);

// this route is for remark and expect newText, bucketId and bucketItemId in the body
router.post(
  "/manage-remark",
  checkAllowance,
  validateManageRemark,
  PostManageRemarks
);

// this route is for deleting bucket item expects the bucketItemId and bucketId in the body
router.delete("/delete", checkAllowance, validateDeleteItem, DeleteItem);

module.exports = router;
