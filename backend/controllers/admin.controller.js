import { User } from '../models/user.model.js';
import { Property } from '../models/property.model.js';

// ─── GET ALL USERS ─────────────────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (role) filter.role = role;

        const skip = (Number(page) - 1) * Number(limit);
        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

// ─── GET SINGLE USER ──────────────────────────────────────────────────────────
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password').populate('favorites');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

// ─── UPDATE USER ROLE ─────────────────────────────────────────────────────────
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['student', 'landlord', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role.' });
        }

        // Prevent demoting yourself
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User role updated.', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user role.' });
    }
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};

// ─── FULL DASHBOARD OVERVIEW STATS ───────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
    try {
        const [
            totalUsers, totalStudents, totalLandlords, totalAdmins,
            totalProperties, availableProperties, fullProperties, comingSoonProperties,
            newUsersThisMonth, newPropertiesThisMonth,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'landlord' }),
            User.countDocuments({ role: 'admin' }),
            Property.countDocuments(),
            Property.countDocuments({ status: 'Available Now' }),
            Property.countDocuments({ status: 'Full' }),
            Property.countDocuments({ status: 'Coming Soon' }),
            User.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
            Property.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } }),
        ]);

        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentProperties = await Property.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title location price status createdAt image');

        res.status(200).json({
            success: true,
            stats: {
                users: { total: totalUsers, students: totalStudents, landlords: totalLandlords, admins: totalAdmins, newThisMonth: newUsersThisMonth },
                properties: { total: totalProperties, available: availableProperties, full: fullProperties, comingSoon: comingSoonProperties, newThisMonth: newPropertiesThisMonth },
                recentUsers,
                recentProperties,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
    }
};
