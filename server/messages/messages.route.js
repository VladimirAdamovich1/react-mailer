const express = require("express");
const router = express.Router();
const usersService = require("./service");

router.get("/api/messages/received", usersService.getReceivedMessages);
router.put("/api/messages/received", usersService.readStatusHandler);
router.get("/api/messages/sent", usersService.getSentMessages);
router.post("/api/messages/sent", usersService.addMessage);
router.delete("/api/messages/sent", usersService.deleteMessage);
module.exports = router;
