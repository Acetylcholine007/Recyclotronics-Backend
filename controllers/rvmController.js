const { validationResult } = require("express-validator/check");
const RVM = require("../models/RVM");
const Scrap = require("../models/Scrap");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getRVM = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "RVM fetched.", data: rvm });
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
      timestamp: new Date().toISOString(),
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

exports.initiateScan = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    if (rvm.status === "IDLE") {
      rvm.status = "SCANNING";
      rvm.user = req.userId;
      //TODO: Update timestamp
      await rvm.save();
      res.status(200).json({ message: "RVM scan initiated." });
    } else {
      res.status(200).json({ message: "RVM is busy scanning." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.reportScan = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    if (rvm.status === "SCANNING") {
      if (req.body.scanResult === true) {
        const scrap = await Scrap.findOne({ name: req.body.scrapType });
        const transaction = new Transaction({
          user: rvm.user,
          action: "DEPOSIT",
          data: {
            scrapType: req.body.scrapType,
            weight: req.body.weight,
            pointsPerGram: scrap.pointsPerGram,
            pesoPerPoints: scrap.pesoPerPoints,
          },
        });
        await transaction.save();
        const user = await User.findById(rvm.user);
        user.points += req.body.weight * scrap.pointsPerGram;
        await user.save();
        res
          .status(200)
          .json({ message: "Scan report acknowledged", data: req.body.scanResult });
      } else {
        res
          .status(200)
          .json({ message: "Scan report acknowledged", data: req.body.scanResult });
      }

      rvm.status = "IDLE";
      rvm.user = null;

      await rvm.save();
      //TODO: Web socket logic
    } else {
      res
        .status(200)
        .json({ message: "RVM scan was not initiated in the Web App." });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.reportStatus = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }

    rvm.binGauge += +req.body.binGauge;
    await rvm.save();

    res
      .status(200)
      .json({ message: "RVM status acknowledged.", data: rvm.binGauge });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putRVM = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    rvm.rvmSerial = req.body.rvmSerial;
    rvm.status = req.body.status;
    rvm.binGauge = req.body.binGauge;
    rvm.timestamp = req.body.timestamp;
    rvm.timeout = req.body.timeout;
    await rvm.save();
    res.status(200).json({ message: "RVM updated.", rvm });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendNotification = async (req, res, next) => {
  try {
    //TODO: Implement logic
    res.status(200).json({ message: "RVM updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.collect = async (req, res, next) => {
  try {
    //TODO: Implement logic
    res.status(200).json({ message: "RVM updated." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
