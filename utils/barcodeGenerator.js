const JsBarcode = require("jsbarcode");
const { DOMImplementation, XMLSerializer } = require("xmldom");

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

    return (svgText = xmlSerializer.serializeToString(svgNode));
  },
};
