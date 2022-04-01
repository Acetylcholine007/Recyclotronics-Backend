const { validationResult } = require("express-validator/check");
const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 12;
  try {
    const totalItems = await Transaction.find().countDocuments();
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Transactions fetched successfully.",
      transactions,
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
    res.status(200).json({ message: "Patient fetched." });
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
    const transaction = await Transaction.findById(tid);
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
