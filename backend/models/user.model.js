import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['landlord', 'student'], default: 'student' },
    phone: { type: String },
    favorites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dorms',
        default: []
    }],
    profilePicture: { type: String, default: '' },
    phone: { type: String, default: '' },

}, { timestamps: true });

export const User =mongoose.model('User', userSchema);