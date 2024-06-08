const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: { type: String, maxLength: 30, required: true },
    password: { type: String, required: true },
    // contacts: { type: Array, default: undefined },
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { toJSON: { virtuals: true } }
);

// UserSchema.virtual("full_name").get(function () {
//     let full_name = `${this.first_name} ${this.last_name}`;
//     return full_name;
// });

module.exports = mongoose.model("User", UserSchema);
