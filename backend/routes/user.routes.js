import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";
import { Property } from "../models/property.model.js"; // Ensure Property model is imported for population
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put('/update_profile',isAuthenticated,upload.single('profilePicture'),updateProfile);


// Get current logged-in user (used by frontend Redux on page load)
router.get("/me", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password").populate("favorites");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }
});


// Toggle favorite
router.put("/favorites/:propertyId", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const propertyId = req.params.propertyId;
        
        // Validate propertyId format
        if (!propertyId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid property ID format." });
        }

        // Check if property exists
        const propertyExists = await Property.findById(propertyId);
        if (!propertyExists) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        // Determine if property is already favorited
        const currentFavorites = user.favorites.map(id => (id._id || id).toString());
        const isFav = currentFavorites.includes(propertyId);

        // Use findByIdAndUpdate to avoid the 'pre-save' hook that might re-hash the password
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            isFav ? { $pull: { favorites: propertyId } } : { $addToSet: { favorites: propertyId } },
            { new: true, runValidators: true }
        ).select("-password").populate("favorites");

        if (!updatedUser) {
            return res.status(500).json({ success: false, message: "Failed to update user favorites in database." });
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Favorite toggle error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error: " + error.message 
        });
    }
});


export default router;