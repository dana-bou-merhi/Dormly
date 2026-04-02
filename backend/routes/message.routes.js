import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getUserConversations, replyToMessage, sendMessage } from "../controllers/messagesController.js";

const router = express.Router();

router.post('/send/message',isAuthenticated,sendMessage);
router.get('/',isAuthenticated,getUserConversations);
router.post('/reply',isAuthenticated,replyToMessage);


export default router;

