const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const ErrorResponse = require("../utils/errorResponse");

const User = require("../model/Users");

exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(new ErrorResponse("user already exists", 400));
  }

  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });

    setToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorResponse("Please Provide Valid Credentials", 400));

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorResponse("User not found", 401));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse("Something went wrong", 401));
    }
    setToken(user, 200, res);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.forgotPassword = async (req, res) => {
  res.send("forgotPassword works234");
};

exports.resetPassword = async (req, res) => {
  res.send("resetPassword works");
};

const setToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
