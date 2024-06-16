require("dotenv").config();
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_create = [
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 30 })
    .withMessage("Email must not exceed 30 characters")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already in use.");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be between 8 and 20 characters"),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Typed passwords do not match"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      contacts: req.body.contacts,
    });

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      await user.save();
      res.json(user);
    }
  })
]

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
