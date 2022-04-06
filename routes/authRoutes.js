const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/User");
const authController = require("../controllers/authController");
const userVerificationMW = require("../middlewares/userVerificationMW");

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
  authController.signup
);

router.post(
  "/user/login",
  [
    body("email").isEmail().trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  authController.login
);

router.post(
  "/user/verify",
  [body("verificationToken").not().isEmpty()],
  userVerificationMW,
  authController.verifyUser
);

router.post(
  "/user/sendVerification",
  [body("email").isEmail().trim().not().isEmpty()],
  authController.sendVerification
);

module.exports = router;
