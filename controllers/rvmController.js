const { validationResult } = require("express-validator/check");
const RVM = require("../models/RVM");

exports.getRVM = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "RVM fetched.", rvm });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postRVM = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const rvm = new RVM({
      rvmSerial: req.body.rvmSerial,
      timestamp: (new Date()).toISOString(),
    });
    await rvm.save();
    res.status(200).json({ message: "RVM created.", rvm });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchRVM = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    rvm.payloadCategory = req.body.payloadCategory;
    rvm.status = req.body.status;
    await rvm.save();
    res.status(200).json({ message: "RVM updated.", rvm });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putRVM = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });

    rvm.password = req.body.password;
    rvm.isVerified = req.body.isVerified;
    await rvm.save();
    res.status(201).json({
      message: "Gateway updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
