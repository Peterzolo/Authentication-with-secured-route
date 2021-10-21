const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please username must be provided"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please Provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECET_KEYS, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
};
UserSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(25).toString("hex");

  this.resetPasswordToken = crypto
    .createhash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("users", UserSchema);

module.exports = User;
