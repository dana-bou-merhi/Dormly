import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MAJOR_AMENITY_MAP } from "../utils/major.amenity.js";

export const register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // 1. Validation
        if (!username || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // 2. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists. Log in directly or use another email"
            });
        }

        // 3. Create User 
        // Note: We pass the plain password because userSchema.pre('save') in User.js hashes it for us.
        await User.create({
            username,
            email,
            password, 
            role
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare passwords using the method we added to the User Schema
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create token using the .env variable
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, 
            { expiresIn: "1d" }
        );

        res.status(200).cookie("token",token,{maxAge: 1*24*60*60*1000,httpOnly: true, sameSite: "strict"}).json({
            message: `Login successful. Welcome ${user.username}`,
            token,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

export const logout = async(_, res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            success:true,
            message:"Logout Successfully"
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // assuming auth middleware sets req.user

    const { username, phone, university, bio, major } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.university = university || user.university;
    user.bio = bio || user.bio;
    // new added 
    user.major = major || user.major; 

    // profile image
    if (req.file) {
      user.profilePicture = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      //req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      user: updatedUser,
      message:"Profile Updated Successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// new added part for major and amenity

export const saveMajor = async (req, res) => {
  try {
    const { major } = req.body;
    if (!major || major === 'skip') return res.json({ success: true });

    await User.findByIdAndUpdate(req.user._id, { major });
    res.json({ success: true });
    console.log(`Saved major ${major} for user ${req.user._id}`);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

