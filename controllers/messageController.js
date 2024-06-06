require("dotenv").config();
const Message = require("../models/message");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_create = asyncHandler(async (req, res, next) => {
  res.json("Created message");
});

exports.message_read_all = asyncHandler(async (req, res, next) => {
  res.json("Read all messages");
});

exports.message_read = asyncHandler(async (req, res, next) => {
  res.json("Read message");
});

exports.message_update = asyncHandler(async (req, res, next) => {
  res.json("Updated message");
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  res.json("Deleted message");
});