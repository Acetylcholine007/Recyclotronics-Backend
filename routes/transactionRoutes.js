const express = require("express");
const { body } = require("express-validator/check");

const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.getTransactions);

router.delete("/", transactionController.deleteTransactions);

router.get("/:tid", transactionController.getTransaction);

router.delete("/:tid", transactionController.deleteTransaction);

module.exports = router;
