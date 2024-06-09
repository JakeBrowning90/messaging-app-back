const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const passport = require("passport");

// CREATE new user
router.post("/", userController.user_create);

// READ all users (for login?)
router.get("/", userController.user_read_all);

// READ all users by search params (for contact search)
// router.get("/?name", userController.user_search);

// READ one user (for login)
router.get("/:id", userController.user_read);

// POST login info
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/failure"
  }),
  userController.user_log_in
);

// UPDATE
router.put("/:id", userController.user_update);

// DELETE
router.delete("/:id", userController.user_delete);

module.exports = router;
