const jwt = require("jsonwebtoken");

const genToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEYS, { expiresIn: "1h" });    
};

module.exports = genToken;
