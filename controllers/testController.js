const barcodeGenerator = require("../utils/barcodeGenerator");

exports.emailVerification = async (req, res, next) => {
  res.render("emailVerification", {
    verificationToken: "a",
  });
};

exports.redeemPoints = async (req, res, next) => {
  res.render("redeemPoints", {
    amount: 10,
    tid: "62504a2e2e4c4c9b7d728519",
  });
};

exports.verificationResult = async (req, res, next) => {
  res.render("verificationResult", { message: "Email successfully verified" });
};

exports.collectionNotif = async (req, res, next) => {
  res.render("collectionNotif", {});
};

exports.generateBarcode = async (req, res, next) => {
  const data = req.params.data;
  const canvas = barcodeGenerator.generateBarcodeImage(data);
  res.setHeader("Content-Type", "image/png");
  canvas.pngStream().pipe(res);
};
