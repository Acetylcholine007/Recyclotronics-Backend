const { validationResult } = require("express-validator/check");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
const ejs = require("ejs");
const path = require("path");
const barcodeGenerator = require("../utils/barcodeGenerator");

exports.getTransactions = async (req, res, next) => {
  const action = req.query.target || null;
  const currentPage = req.query.page || 1;
  const perPage = 12;
  try {
    const totalItems = await Transaction.find(
      action ? { action } : {}
    ).countDocuments();
    const transactions = await Transaction.find(action ? { action } : {})
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("user");
    res.status(200).json({
      message: "Transactions fetched successfully.",
      data: transactions,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTransactions = async (req, res, next) => {
  try {
    res.status(200).json({ message: "Transactions deleted." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.redeem = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const amount = req.body.amount;

    // const transactions = await Promise.all(
    //   transactionIds.map(async (id) => {
    //     return await Transaction.findById(id);
    //   })
    // );

    if (amount <= user.balance) {
      user.balance -= amount;
      const transaction = new Transaction({
        user: user._id,
        action: "REDEEM",
        data: { amount },
      });
      await user.save();
      await transaction.save();

      const barcode = barcodeGenerator.generateBarcode(
        transaction._id.toString()
      );
      const htmlTemplate = await ejs.renderFile(
        path.join(__dirname, "../views/redeemPoints.ejs"),
        { amount, barcode }
      );
      sendMail.sendMail(user.email, "REDEEM POINTS", htmlTemplate);
      res
        .status(200)
        .json({
          message: "Amount redeemed. Check your email for confirmation.",
          data: { balance: user.balance },
        });
    } else {
      res.status(406).json({
        message: "Amount trying to claim is more than the amount you have.",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserTransactions = async (req, res, next) => {
  const userId = req.params.userId;
  const action = req.query.target || null;
  const currentPage = req.query.page || 1;
  const perPage = 12;
  try {
    const totalItems = await Transaction.find(
      action ? { user: userId, action } : { user: userId }
    ).countDocuments();
    const transactions = await Transaction.find(
      action ? { user: userId, action } : { user: userId }
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("user");
    res.status(200).json({
      message: "Transactions fetched successfully.",
      data: transactions,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const tid = req.params.tid;
    const transaction = await Transaction.findById(tid);
    if (!transaction) {
      const error = new Error("Could not find transaction.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Transaction fetched.", transaction });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tid = req.params.tid;
    await Transaction.findByIdAndRemove(tid);
    res.status(201).json({
      message: "Transacion deleted",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
