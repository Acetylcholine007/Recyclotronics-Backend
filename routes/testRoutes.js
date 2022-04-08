const express = require("express");

const testController = require("../controllers/testController");

const router = express.Router();

router.get("/emailVerification", testController.emailVerification);

router.get("/redeemPoints", testController.redeemPoints);

router.get("/verificationResult", testController.verificationResult);

module.exports = router;
