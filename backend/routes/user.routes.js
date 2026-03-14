import express from "express";
import { register, login } from "../controllers/user.controller.js";

console.log("My URI is:", process.env.MONGO_URI);
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

export default router;