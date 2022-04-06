const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const ejs = require("ejs");
const path = require("path");

exports.signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const fullname = req.body.fullname;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      fullname,
      email,
      password: hashedPw,
    });
    const result = await user.save();
    res
      .status(201)
      .json({ message: "User created", data: { userId: result._id } });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("Email does not exist");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
        accountType: loadedUser.accountType,
      },
      process.env.SECRET_KEY
      // { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Successfully logged In",
      data: {
        token: token,
        userId: loadedUser._id.toString(),
        accountType: loadedUser.accountType,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.verifyEmail });
    user.isVerified = true;
    await user.save();
    console.log(user);
    res.status(201).json({
      message: "User verified",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendVerification = async (req, res, next) => {
  try {
    const verificationToken = jwt.sign(
      {
        verifyEmail: req.body.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const htmlTemplate = await ejs.renderFile(
      path.join(__dirname, "../views/emailVerification.ejs"),
      { verificationToken }
    );
    sendMail.sendMail(
      req.body.email,
      "VERIFY EMAIL",
      htmlTemplate
    );

    res.status(201).json({
      message: "Verification email sent",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};