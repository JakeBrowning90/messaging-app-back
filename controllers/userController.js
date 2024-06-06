require("dotenv").config();
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

exports.user_create = asyncHandler(async (req, res, next) => {
  res.json("Created user");
});

exports.user_read_all = asyncHandler(async (req, res, next) => {
  res.json("Read all users");
});

exports.user_read = asyncHandler(async (req, res, next) => {
  res.json("Read user");
});

exports.user_update = asyncHandler(async (req, res, next) => {
  res.json("Updated user");
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  res.json("Deleted user");
});
