require("dotenv").config();
const User = require("../models/user");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.user_create = [
  body("displayName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Display name required")
    .isLength({ max: 30 })
    .withMessage("Display name must not exceed 30 characters"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ max: 30 })
    .withMessage("Email must not exceed 30 characters")
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value.toLowerCase() });
      if (existingUser) {
        throw new Error("Email already in use");
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
      displayName: req.body.displayName,
      status: "New user",
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      contacts: req.body.contacts,
    });

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      await user.save();
      res.json(user);
    }
  }),
];

exports.user_read_all = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const search = new RegExp(`${req.query.name}`, 'i');
      const allUsers = await User.find({ displayName: search })
        .populate("contacts", ["displayName", "status"])
        .exec();
      res.json(allUsers);
    }
  });
});

exports.user_read = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const user = await User.findById(req.params.id)
        .populate("contacts", ["displayName", "status"])
        .exec();
      res.json(user);
    }
  });
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

exports.user_update = [
  body("displayName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Display name required")
    .isLength({ max: 30 })
    .withMessage("Display name must not exceed 30 characters"),
  body("status")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Status required")
    .isLength({ max: 30 })
    .withMessage("Status must not exceed 30 characters"),
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
    const sendingUser = await User.findById(req.params.id).exec();

    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      displayName: req.body.displayName,
      status: req.body.status,
      email: sendingUser.email,
      password: hashedPassword,
      contacts: sendingUser.contacts,
      _id: req.params.id,
    });
    // await User.findByIdAndUpdate(req.params.id, user);
    // res.json(user);
    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      await User.findByIdAndUpdate(req.params.id, user);
      res.json(user);
    }
  }),
];

exports.user_contact_update = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const sendingUser = await User.findById(req.params.id).exec();
      let addedContactId = req.body.contacts[req.body.contacts.length - 1];
      const addedContact = await User.findById(addedContactId).exec();
      let recipContacts = addedContact.contacts;
      recipContacts.push(req.params.id);

      const user1 = new User({
        displayName: sendingUser.displayName,
        status: sendingUser.status,
        email: sendingUser.email,
        password: sendingUser.password,
        contacts: req.body.contacts,
        _id: req.params.id,
      });
      await User.findByIdAndUpdate(req.params.id, user1);

      const user2 = new User({
        displayName: addedContact.displayName,
        status: addedContact.status,
        email: addedContact.email,
        password: addedContact.password,
        contacts: recipContacts,
        _id: addedContactId,
      });
      await User.findByIdAndUpdate(addedContactId, user2);

      next();
    }
  });
});

exports.user_delete = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("Deleted User");
});
