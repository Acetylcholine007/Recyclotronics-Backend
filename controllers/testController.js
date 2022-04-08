const barcodeGenerator = require("../utils/barcodeGenerator");

exports.emailVerification = async (req, res, next) => {
  res.render("emailVerification", {
    verificationToken: "a",
  });
};

exports.redeemPoints = async (req, res, next) => {
  const barcode = barcodeGenerator.generateBarcode("10");
  res.render("redeemPoints", {
    amount: 10,
    barcode
  });
};

exports.verificationResult = async (req, res, next) => {
  res.render("verificationResult", { message: "Email successfully verified" });
};

exports.collectionNotif = async (req, res, next) => {
  res.render("collectionNotif", {});
};
