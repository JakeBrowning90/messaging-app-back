const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// CREATE new message
router.post("/", messageController.message_create);

// READ all messages (Prob don't need this?)
router.get("/", messageController.message_read_all);

// READ all messages between user and contact
router.get("/:id/:contact", messageController.message_read_convo);

// READ one message (Prob don't need this?)
router.get("/:id", messageController.message_read);

// UPDATE message (Prob don't need this)
// router.put("/:id", messageController.message_update);

// WITHDRAW message (Specific UPDATE in place of DELETE)
router.put("/:id", messageController.message_withdraw);

// DELETE (Prob don't need this?)
router.delete("/:id", messageController.message_delete);

module.exports = router;
