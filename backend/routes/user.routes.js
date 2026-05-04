import express from "express";
import { register, login, logout, updateProfile, saveMajor, getUserFavorites, addToFavorite } from "../controllers/user.controller.js";
import { googleAuth, linkedinAuth } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import { upload } from "../middleware/upload.js";
 
const router = express.Router();
 

router.post("/register", register);
router.post("/login",    login);
router.get("/logout",    logout);
 
router.post("/auth/google",   googleAuth);
router.post("/auth/linkedin", linkedinAuth);
 
// Current user
router.get("/me", isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});


router.post('/major',isAuthenticated, saveMajor);

router.put("/update_profile", isAuthenticated, upload.single("profilePicture"), updateProfile);
 
//  favorite
router.get("/favorites", isAuthenticated, getUserFavorites);
router.put("/favorites/:propertyId", isAuthenticated,addToFavorite);

 
export default router;