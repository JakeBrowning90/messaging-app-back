const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    displayName: { type: String, maxLength: 30, required: true },
    status: { type: String, maxLength: 30, required: true },
    email: { type: String, maxLength: 30, required: true },
    password: { type: String, required: true },
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { toJSON: { virtuals: true } }
);

module.exports = mongoose.model("User", UserSchema);
