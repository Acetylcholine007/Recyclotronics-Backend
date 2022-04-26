const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scrapSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    pointsPerKilo: {
      type: Number,
      required: true,
      default: 1,
    },
    previousPPK: {
      type: Number,
      required: true,
      default: 1,
    },
    pesoPerPoints: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scrap", scrapSchema);
