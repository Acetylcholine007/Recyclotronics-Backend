const express = require("express");
const { body } = require("express-validator/check");

const scrapController = require("../controllers/scrapController");

const router = express.Router();

router.get("/", scrapController.getScraps);

router.post("/", scrapController.postScrap);

router.get("/:scrapId", scrapController.getScrap);

router.put("/:scrapId", scrapController.putScrap);

router.delete("/:scrapId", scrapController.deleteScrap);

module.exports = router;
