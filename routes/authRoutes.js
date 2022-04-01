const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/User");
const userController = require("../controllers/userController");

const router = express.Router();

router.post(
  "/user/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("fullname").trim().not().isEmpty(),
  ],
  userController.signup
);

router.post(
  "/user/login",
  [
    body("email").isEmail().trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  userController.login
);

module.exports = router;
