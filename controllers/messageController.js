require("dotenv").config();
const Message = require("../models/message");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.message_create = asyncHandler(async (req, res, next) => {
  const message = new Message({
    author: req.body.author,
    recipient: req.body.recipient,
    body: req.body.body,
  });

  await message.save();
  res.json(message);
});

exports.message_read_all = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find().exec();
  res.json(allMessages);
});

exports.message_read_convo = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({
    $or: [
      { author: req.params.id, recipient: req.params.contact },
      { author: req.params.contact, recipient: req.params.id },
    ],
  }).exec();
  res.json(allMessages);
});

exports.message_read = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();
  res.json(message);
});

exports.message_update = asyncHandler(async (req, res, next) => {
  const message = new Message({
    author: req.body.author,
    recipient: req.body.recipient,
    body: req.body.body,
    _id: req.params.id,
  });
  await Message.findByIdAndUpdate(req.params.id, message);
  res.json(message);
});

exports.message_delete = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json("Deleted message");
});
