const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const passport = require("passport");
middlewares = require("../config/middlewares")

// CREATE new user
router.post("/", userController.user_create);

// READ all users (Returns users matching regex)*
router.get("/", middlewares.verifyToken, userController.user_read_all);

// READ one user (Gets current user info for session)*
router.get("/:id", middlewares.verifyToken, userController.user_read);

// POST login info
router.post(
  "/log-in",
  passport.authenticate("local", {
    // successRedirect: "/success",
    // failureRedirect: "/failure",
    session: false
  }),
  userController.user_log_in
);

// UPDATE Display name, Status, PW 
router.put("/:id", userController.user_update);

// UPDATE Contacts array *
router.put("/add-contact/:id", middlewares.verifyToken, userController.user_contact_update);

// DELETE (currently unused)
router.delete("/:id", userController.user_delete);

module.exports = router;
