import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
