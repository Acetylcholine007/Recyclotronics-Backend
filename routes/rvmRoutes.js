const express = require("express");
const { body } = require("express-validator/check");

const rvmController = require("../controllers/rvmController");
const userAuthMW = require("../middlewares/userAuthMW");
const RVM = require("../models/RVM");

const router = express.Router();

router.post(
  "/",
  [
    body("rvmSerial").custom((value, { req }) => {
      return RVM.findOne({ rvmSerial: value }).then((rvmDoc) => {
        if (rvmDoc) {
          return Promise.reject("RVM already exists");
        }
      });
    }),
  ],
  userAuthMW,
  rvmController.postRVM
);

router.get("/:rvmSerial", userAuthMW, rvmController.getRVM);

router.patch(
  "/initiateScan/:rvmSerial",
  userAuthMW,
  rvmController.initiateScan
);

router.patch("/reportScan/:rvmSerial", rvmController.reportScan); //For RVM machine

router.patch("/reportStatus/:rvmSerial", rvmController.reportStatus); //For RVM machine

router.put("/updateRVM/:rvmSerial", userAuthMW, rvmController.putRVM);

router.post("/sendNotification", userAuthMW, rvmController.sendNotification);

router.post("/collect", userAuthMW, rvmController.collect);

module.exports = router;
