import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['landlord', 'student', 'admin'], default: 'student' },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property', // Changed from 'Dorms' to 'Property' to match property.model.js
        default: []
    }],
    profilePicture: { type: String, default: '/images/user.jpeg' },
    phone: { type: String, default: '' },
    university:{type: String, default:'Lebanese University'},
    bio:{type: String, default:''}
}, { timestamps: true });

// AUTO-HASH: Only hash if password is modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// LOGIN HELPER
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);