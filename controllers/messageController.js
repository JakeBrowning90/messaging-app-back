require("dotenv").config();
const Message = require("../models/message");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Create new message with Author and Recipient
exports.message_create = asyncHandler(async (req, res, next) => {
  const message = new Message({
    author: req.body.author,
    recipient: req.body.recipient,
    body: req.body.body,
  });

  await message.save();
  res.json(message);
});

// Read ALL messages (demo function)
exports.message_read_all = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find().exec();
  res.json(allMessages);
});

// Read ALL messages between 2 users as either Author and Recipient
exports.message_read_convo = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({
    $or: [
      { author: req.params.id, recipient: req.params.contact },
      { author: req.params.contact, recipient: req.params.id },
    ],
  }).exec();
  res.json(allMessages);
});

// Read ONE message (demo function)
exports.message_read = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();
  res.json(message);
});

// Update ONE message (demo function)
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

// "Delete" message by removing body, preserve timestamp and users for convo history
exports.message_withdraw = asyncHandler(async (req, res, next) => {
  const message = new Message({
    author: req.body.author,
    recipient: req.body.recipient,
    body: "Message deleted",
    isWithdrawn: true,
    _id: req.params.id,
  });
  await Message.findByIdAndUpdate(req.params.id, message);
  res.json(message);
});

// Delete ONE message (demo function)
exports.message_delete = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json("Deleted message");
});
