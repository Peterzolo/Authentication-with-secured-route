const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const ErrorResponse = require("../utils/errorResponse");

const User = require("../model/Users");
const mailService = require("../utils/mailService");
const { text } = require("express");

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

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return next(new ErrorResponse("Error occured", 404));
    }

    const resetToken = userExists.generateResetPasswordToken();

    await userExists.save();
    const resetUrl = `${process.env.RESET_URL}/resetpassword/${resetToken}`;

    const message = `
    <h1>You have just requested for a password reset</h1>
    <p>Please click on this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl} </a>
    `;

    try {
      await mailService({
        to: userExists.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email successfully sent" });
    } catch (error) {
      userExists.resetPasswordToken = undefined;
      userExists.resetPasswordExpire = undefined;
    }

    await userExists.save();
    return next(new ErrorResponse("Email could not be sent", 500));
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res) => {
  res.send("resetPassword works");
};

const setToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, token });
};
