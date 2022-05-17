const { validationResult } = require("express-validator/check");
const RVM = require("../models/RVM");
const Scrap = require("../models/Scrap");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const io = require("../utils/socket");
const sendMail = require("../utils/sendMail");
const ejs = require("ejs");
const path = require("path");

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
      collectorEmail: req.body.collectorEmail,
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

    const difference = new Date() - new Date(rvm.updatedAt);
    const isTimedOut = difference / 60000 > rvm.timeout;

    if (rvm.status === "IDLE" || (rvm.status === "SCANNING" && isTimedOut)) {
      rvm.status = "SCANNING";
      rvm.user = req.userId;
      await rvm.save();
      res.status(200).json({ message: "RVM scan initiated." });
    } else if (
      rvm.status === "SCANNING" &&
      req.userId === rvm.user.toString() &&
      !isTimedOut
    ) {
      res.status(200).json({ message: "RVM scan already initiated." });
    } else {
      res.status(409).json({
        message:
          "RVM is currently processing a different user request. Try again after 3 minutes.",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.cancelScan = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });

    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }

    rvm.status = "IDLE";
    rvm.user = null;
    await rvm.save();

    res.status(200).json({ message: "RVM scan cancelled." });
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
      const scrap = await Scrap.findOne({ name: req.body.scrapType });
      if (req.body.scanResult === true) {
        const transaction = new Transaction({
          user: rvm.user,
          action: "DEPOSIT",
          data: {
            scrapType: req.body.scrapType,
            weight: req.body.weight,
            pointsPerKilo: scrap.pointsPerKilo,
            pesoPerPoints: scrap.pesoPerPoints,
          },
        });
        await transaction.save();
        const user = await User.findById(rvm.user);
        user.balance +=
          req.body.weight * scrap.pointsPerKilo * scrap.pesoPerPoints;
        await user.save();

        io.getIO().emit("scan", {
          scanResult: req.body.scanResult,
          payload: {
            scrapType: req.body.scrapType,
            weight: req.body.weight,
            pointsPerKilo: scrap.pointsPerKilo,
            pesoPerPoints: scrap.pesoPerPoints,
          },
        });

        res.status(200).json({
          message: "Scan report acknowledged",
          data: req.body.scanResult,
        });
      } else {
        io.getIO().emit("scan", {
          scanResult: req.body.scanResult,
          payload: {
            scrapType: req.body.scrapType,
            weight: 0,
            pointsPerKilo: 0,
            pesoPerPoints: 0,
          },
        });

        res.status(200).json({
          message: "Scan report acknowledged",
          data: req.body.scanResult,
        });
      }

      rvm.status = "IDLE";
      rvm.user = null;
      await rvm.save();
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
    if (req.body.binGauge > 100 || req.body.binGauge < 0) {
      const error = new Error("Bin gauge percentage out of bounds");
      error.statusCode = 404;
      throw error;
    }

    rvm.binGauge = +req.body.binGauge;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

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
    rvm.collectorEmail = req.body.collectorEmail;
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
    const rvmSerial = req.params.rvmSerial;
    const message = req.body.message;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    const htmlTemplate = await ejs.renderFile(
      path.join(__dirname, "../views/collectionNotif.ejs"),
      { message }
    );
    const result = await sendMail.sendMailPromise(
      rvm.collectorEmail,
      "BIN COLLECTION NOTIFICATION",
      htmlTemplate
    );
    console.log(result);

    res.status(200).json({ message: "Notification email sent" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.collect = async (req, res, next) => {
  try {
    const rvmSerial = req.params.rvmSerial;
    const rvm = await RVM.findOne({ rvmSerial });
    if (!rvm) {
      const error = new Error("Could not find RVM.");
      error.statusCode = 404;
      throw error;
    }
    rvm.collectionHistory = [
      ...rvm.collectionHistory,
      {
        timestamp: req.body.timestamp,
        status: req.body.status,
      },
    ];
    await rvm.save();
    res.status(200).json({
      message: "RVM updated.",
      data: {
        timestamp: req.body.timestamp,
        status: req.body.status,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
