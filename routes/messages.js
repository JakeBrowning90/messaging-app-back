const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// CREATE new message
router.post("/", messageController.message_create);

// READ all messages (for login)
router.get("/", messageController.message_read_all);

// READ one messages
router.get("/:id", messageController.message_read);

// UPDATE message (Prob don't need this)
router.put("/:id", messageController.message_update);

// DELETE (Prob don't need this?)
router.delete("/:id", messageController.message_delete);

module.exports = router;
