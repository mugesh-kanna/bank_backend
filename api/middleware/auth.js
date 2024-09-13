const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  return next();
};

module.exports = verifytoken;