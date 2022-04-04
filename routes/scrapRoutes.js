const express = require("express");
const { body } = require("express-validator/check");

const scrapController = require("../controllers/scrapController");
const Scrap = require("../models/Scrap");

const router = express.Router();

router.get("/", scrapController.getScraps);

router.post(
  "/",
  [
    body("name").custom((value, { req }) => {
      return Scrap.findOne({ name: value }).then((scrapDoc) => {
        if (scrapDoc) {
          return Promise.reject("Scrap already exists");
        }
      });
    }),
  ],
  scrapController.postScrap
);

router.get("/:scrapId", scrapController.getScrap);

router.put("/:scrapId", scrapController.putScrap);

router.delete("/:scrapId", scrapController.deleteScrap);

module.exports = router;
