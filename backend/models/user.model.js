import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
 
const userSchema = new mongoose.Schema({
    username:       { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    password:       { type: String, default: '' },   // empty for OAuth users
    role:           { type: String, enum: ['landlord', 'student', 'admin'], default: 'student' },
    authProvider:   { type: String, enum: ['local', 'google', 'linkedin'], default: 'local' },
    providerId:     { type: String, default: '' },   // Google/LinkedIn sub/id
    favorites:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: [] }],
    profilePicture: { type: String, default: '/images/user.jpeg' },
    phone:          { type: String, default: '' },
    university:     { type: String, default: 'Lebanese University' },
    bio:            { type: String, default: '' },
    // new added part 
    major: { type: String, default: '' },
}, { timestamps: true });
 
// Only hash if password is set and modified
userSchema.pre('save', async function () {
    // 1. Skip if password isn't modified OR if it's empty (OAuth users)
    if (!this.isModified('password') || !this.password) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // No next() needed here! Resolving the async function is enough.
    } catch (error) {
        // If there's an error, throw it; Mongoose will catch it.
        throw error;
    }
});
 
userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};
 
export const User = mongoose.model('User', userSchema);