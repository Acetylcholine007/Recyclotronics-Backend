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

router.get("/:rvmSerial", rvmController.getRVM);

router.patch("/:rvmSerial", rvmController.patchRVM);

router.put("/:rvmSerial", rvmController.putRVM);

module.exports = router;
