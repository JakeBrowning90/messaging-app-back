const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

// CREATE new user
router.post("/", userController.user_create);

// READ all users (for login)
router.get("/", userController.user_read_all);

// READ one user (for login)
router.get("/:id", userController.user_read);

// UPDATE
router.put("/:id", userController.user_update);

// DELETE
router.delete("/:id", userController.user_delete);

// Login
// router.post('/login',
//     passport.authenticate('local', {
//         // failureMessage: true
//     }),
//     userController.user_login
// );

module.exports = router;
