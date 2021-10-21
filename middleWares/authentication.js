const jwt = require("jsonwebtoken");
const User = require("../model//Users");
const ErrorResponse = require("../utils/errorResponse");

exports.secured = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("You are not authorized", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECET_KEYS);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorResponse("Found no user with this ID", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorResponse("Access Denied", 401));
  }
};
