require("dotenv").config();
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_create = asyncHandler(async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      contacts: req.body.contacts,
    });
    await user.save();
    res.json(user);
  } catch (err) {
    return next(err);
  }
});

exports.user_read_all = asyncHandler(async (req, res, next) => {
  const search = new RegExp(`${req.query.name}`);
  const allUsers = await User.find({ email: search })
    .populate("contacts", "email")
    .exec();
  res.json(allUsers);
});

// exports.user_search = asyncHandler(async (req, res, next) => {
//   const allUsers = await User.find().populate('contacts', 'email').exec();
//   res.json(allUsers);
// });

exports.user_read = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate("contacts", "email")
    .exec();
  res.json(user);
});

exports.user_log_in = asyncHandler(async (req, res, next) => {
  jwt.sign(
    { user: req.user },
    process.env.SECRET_KEY,
    { expiresIn: "30m" },
    (err, token) => {
      res.json({
        email: req.user.email,
        id: req.user._id,
        // Add "Bearer" on frontend
        token: token,
      });
    }
  );
});

exports.user_update = asyncHandler(async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    contacts: req.body.contacts,
    _id: req.params.id,
  });
  await User.findByIdAndUpdate(req.params.id, user);
  res.json(user);
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Deleted User");
});
