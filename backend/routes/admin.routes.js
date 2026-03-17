import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getDashboardStats,
} from '../controllers/admin.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(isAuthenticated, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
