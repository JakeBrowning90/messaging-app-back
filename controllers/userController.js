require("dotenv").config();
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.user_create = asyncHandler(async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();
  res.json(user);
});

exports.user_read_all = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find().exec();
  res.json(allUsers);
});

exports.user_read = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();
  res.json(user);
});

exports.user_update = asyncHandler(async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    _id: req.params.id,
  });
  await User.findByIdAndUpdate(req.params.id, user);
  res.json(user);
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Deleted User");
});
