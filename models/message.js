const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true },
    isWithdrawn: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("Message", MessageSchema);
