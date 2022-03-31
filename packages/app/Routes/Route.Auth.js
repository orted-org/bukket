const express = require("express");
const router = express.Router();
const {
  LoginPost,
  LoginGet,
} = require("../Controllers/Auth/Controller.Auth.Login");
const Logout = require("../Controllers/Auth/Controller.Auth.Logout");
const {
  checkAllowance,
} = require("../Controllers/Auth/Controller.Auth.CheckAllowance");

//login routes
router.post("/login", LoginPost);
router.get("/login", LoginGet);

//logout routes
router.delete("/logout", checkAllowance, Logout);

module.exports = router;
