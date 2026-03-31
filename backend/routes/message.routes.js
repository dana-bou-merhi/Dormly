import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getUserConversations, sendMessage } from "../controllers/messagesController.js";

const router = express.Router();

router.post('/send/message',isAuthenticated,sendMessage);
router.get('/',isAuthenticated,getUserConversations)

export default router;

