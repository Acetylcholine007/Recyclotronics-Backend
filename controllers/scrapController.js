const { validationResult } = require("express-validator/check");
const Scrap = require("../models/Scrap");

exports.getScraps = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 12;
    const totalItems = await Scrap.find().countDocuments();
    const scraps = await Scrap.find()
      //   .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: "Scraps fetched successfully.",
      data: scraps,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postScrap = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const scrap = new Scrap({
      name: req.body.name,
    });
    await scrap.save();
    res.status(200).json({ message: "Scrap created.", scrap });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getScrap = async (req, res, next) => {
  try {
    const scrapId = req.params.scrapId;
    const scrap = await Scrap.findById(scrapId);
    if (!scrap) {
      const error = new Error("Could not find Scrap.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Scrap fetched.", scrap });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putScrap = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const scrapId = req.params.scrapId;
    const scrap = await Scrap.findById(scrapId);
    
    scrap.name = req.body.name;
    scrap.previousPPG = scrap.pointsPerGram;
    scrap.pointsPerGram = req.body.pointsPerGram;
    scrap.pesoPerPoints = req.body.pesoPerPoints;
    await scrap.save();
    res.status(200).json({
      message: "Scrap updated",
      data: scrap,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteScrap = async (req, res, next) => {
  try {
    const scrapId = req.params.scrapId;
    await Scrap.findByIdAndRemove(scrapId);

    res.status(200).json({
      message: "Scrap removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
