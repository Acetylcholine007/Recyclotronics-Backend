const express = require("express");
const { body } = require("express-validator/check");

const transactionController = require("../controllers/transactionController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", userAuthMW,  transactionController.getTransactions);

router.delete("/", userAuthMW, transactionController.deleteTransactions);

router.post("/redeem", userAuthMW, transactionController.redeem);

router.get("/user/:userId", userAuthMW, transactionController.getUserTransactions);

router.get("/:tid", userAuthMW, transactionController.getTransaction);

router.delete("/:tid", userAuthMW, transactionController.deleteTransaction);

module.exports = router;
