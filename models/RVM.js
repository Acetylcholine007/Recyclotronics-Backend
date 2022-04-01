const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rvmSchema = new Schema({
  rvmSerial: {
    type: String,
    required: true,
  },
  payloadCategory: {
    type: String, //DEVICE | PHERIPHERAL | COMPONENT
    required: true,
    default: "DEVICE",
  },
  payloadWeight: {
    type: Number,
    required: true,
    default: 0,
  },
  scanResult: {
    type: String, //NONE, SUCCESS, FAILED
    required: true,
    default: "NONE",
  },
  status: {
    type: String, //PENDING | PROCESSING | SCANNING
    required: true,
    default: "PENDING",
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  timestamp: {
    type: String,
    required: true,
  },
  timeout: {
    type: Number,
    required: true,
    default: 3,
  }
});

module.exports = mongoose.model("RVM", rvmSchema);
