import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

// Shared helper: sign JWT + set cookie + return user
const signTokenAndRespond = (res, user) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res
        .status(200)
        .cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
        .json({
            success: true,
            message: `Welcome, ${user.username}!`,
            token,
            user,
        });
};

// ── Google OAuth ──────────────────────────────────────────────────────────────
// Frontend sends the Google ID token after user clicks "Sign in with Google"
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ success: false, message: 'No Google credential provided.' });

        // Decode the JWT from Google (we verify the signature via Google's public keys)
        const { OAuth2Client } = await import('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        if (!email) return res.status(400).json({ success: false, message: 'Could not get email from Google.' });

        // Find existing user or create new one
        let user = await User.findOne({ email });

        if (user) {
            // Update provider info if they previously used email/password
            if (user.authProvider === 'local') {
                user.authProvider = 'google';
                user.providerId = googleId;
                if (picture && user.profilePicture === 'http://localhost:5173/images/user.jpeg') user.profilePicture = picture;
                await user.save();
            }
        } else {
            user = await User.create({
                username:       name || email.split('@')[0],
                email,
                password:       '',
                authProvider:   'google',
                providerId:     googleId,
                profilePicture: picture || 'http://localhost:5173/images/user.jpeg',
                role:           'student',
            });
        }

        signTokenAndRespond(res, user);
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ success: false, message: 'Google authentication failed.' });
    }
};

// ── LinkedIn OAuth ────────────────────────────────────────────────────────────
// LinkedIn uses OAuth2 code flow. Frontend sends the authorization code,
// backend exchanges it for an access token, then fetches the user profile.
export const linkedinAuth = async (req, res) => {
    try {
        const { code, redirectUri } = req.body;
        if (!code) return res.status(400).json({ success: false, message: 'No LinkedIn code provided.' });

        // 1. Exchange code for access token
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type:    'authorization_code',
                code,
                redirect_uri:  redirectUri || process.env.LINKEDIN_REDIRECT_URI,
                client_id:     process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
        });

        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
            return res.status(400).json({ success: false, message: 'Failed to get LinkedIn access token.' });
        }

        // 2. Fetch LinkedIn profile (userinfo endpoint – works with OpenID Connect scope)
        const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const profile = await profileRes.json();

        const { sub: linkedinId, email, name, picture } = profile;

        if (!email) return res.status(400).json({ success: false, message: 'Could not get email from LinkedIn. Make sure you have email scope enabled.' });

        // 3. Find or create user
        let user = await User.findOne({ email });

        if (user) {
            if (user.authProvider === 'local') {
                user.authProvider = 'linkedin';
                user.providerId = linkedinId;
                if (picture && user.profilePicture === '/images/user.jpeg') user.profilePicture = picture;
                await user.save();
            }
        } else {
            user = await User.create({
                username:       name || email.split('@')[0],
                email,
                password:       '',
                authProvider:   'linkedin',
                providerId:     linkedinId,
                profilePicture: picture || '/images/user.jpeg',
                role:           'student',
            });
        }

        signTokenAndRespond(res, user);
    } catch (error) {
        console.error('LinkedIn auth error:', error);
        res.status(500).json({ success: false, message: 'LinkedIn authentication failed.' });
    }
};
