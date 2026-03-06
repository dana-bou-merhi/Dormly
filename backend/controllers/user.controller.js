import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req, res)=>{

    const{username, email, password, role}=req.body;

    try {
        if(!username || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"});
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // test email 
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email"
            })
        }
        if(password.length < 6){
            return res.status(400).json({
                success:false,
                message:"Password must be at least 6 characters"
            })
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already exist. Login in directly or use another email"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password:hashedPassword,
            role
        })
        return res.status(201).json({
            success:true,
            message:"User registered successfully"
        })

       


    } catch (error) {
         console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }

}