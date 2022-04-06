const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator/check");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Failed to pass validation");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const token = req.body.verificationToken;
  if (!token) {
    const error = new Error("Failed to verify.");
    error.statusCode = 401;
    throw error;
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Failed to verify.");
    error.statusCode = 401;
    throw error;
  }
  req.verifyEmail = decodedToken.verifyEmail;
  next();
};
