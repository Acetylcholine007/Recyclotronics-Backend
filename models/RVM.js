const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rvmSchema = new Schema(
  {
    rvmSerial: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String, //IDLE | SCANNING
      required: true,
      default: "IDLE",
    },
    binGauge: {
      type: Number,
      required: true,
      default: 0,
    },
    collectorEmail: {
      type: String,
      required: true,
    },
    timeout: {
      type: Number,
      required: true,
      default: 3,
    },
    collectionHistory: [{ type: Object }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("RVM", rvmSchema);
