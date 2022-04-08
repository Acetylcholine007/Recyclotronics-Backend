const express = require("express");

const testController = require("../controllers/testController");

const router = express.Router();

router.get("/emailVerification", testController.emailVerification);

router.get("/redeemPoints", testController.redeemPoints);

router.get("/verificationResult", testController.verificationResult);

router.get("/collectionNotif", testController.collectionNotif);

router.get("/generateBarcode/:data", testController.generateBarcode)

module.exports = router;
