import express from "express";
import { register, login, logout, updateProfile, saveMajor } from "../controllers/user.controller.js";
import { googleAuth, linkedinAuth } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import { upload } from "../middleware/upload.js";
 
const router = express.Router();
 
// Auth
router.post("/register", register);
router.post("/login",    login);
router.get("/logout",    logout);
 
// Social OAuth
router.post("/auth/google",   googleAuth);
router.post("/auth/linkedin", linkedinAuth);
 
// Current user
router.get("/me", isAuthenticated, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

// new added route for the major 
router.post('/major',isAuthenticated, saveMajor);


// Update profile
router.put("/update_profile", isAuthenticated, upload.single("profilePicture"), updateProfile);
 
// Toggle favorite
router.put("/favorites/:propertyId", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const propertyId = req.params.propertyId;
        const isFav = user.favorites.some(id => id.toString() === propertyId);
 
        if (isFav) {
            user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
        } else {
            user.favorites.push(propertyId);
        }
 
        await user.save();
        const updated = await User.findById(user._id)
            .select("-password")
            .populate("favorites");
        res.status(200).json({ success: true, user: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update favorites." });
    }
});
 
export default router;