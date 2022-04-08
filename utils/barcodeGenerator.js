const JsBarcode = require("jsbarcode");
const { DOMImplementation, XMLSerializer } = require("xmldom");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path")

module.exports = {
  generateBarcode: (dataString) => {
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument(
      "http://www.w3.org/1999/xhtml",
      "html",
      null
    );
    const svgNode = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    JsBarcode(svgNode, dataString, {
      xmlDocument: document,
    });

    return xmlSerializer.serializeToString(svgNode);
  },
  generateBarcodeImage: (dataString) => {
    const canvas = createCanvas();

    JsBarcode(canvas, dataString);

    // const buffer = canvas.toBuffer("image/png");
    // fs.writeFileSync(path.join(__dirname, "../public/barcode/barcode.png"), buffer);

    return canvas;
  },
};
