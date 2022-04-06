const { validationResult } = require("express-validator/check");
const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    if (req.accountType !== 2) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const currentPage = req.query.page || 1;
    const perPage = 12;
    const totalItems = await User.find().countDocuments();
    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Users fetched successfully.",
      data: users,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (req.accountType !== 2 && req.userId !== userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "User fetched.", data: user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const userId = req.params.userId;
    if (req.accountType !== 2 && req.userId !== userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const user = await User.findById(userId);

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.password = req.body.password;
    await user.save();
    res.status(201).json({
      message: "User updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (req.accountType !== 2 && req.userId !== userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    if (userId === undefined) {
      const error = new Error("No userId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await User.findByIdAndRemove(userId);

    res.status(201).json({
      message: "User Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
