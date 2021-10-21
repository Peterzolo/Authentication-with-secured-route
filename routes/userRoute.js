const express = require("express");

const router = express.Router();

const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers//userController");

router.post("/register", signUp);
router.post("/login", signIn);
router.post("/forgotpassword", forgotPassword);   
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;   
