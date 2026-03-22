import express from 'express';
import {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyStats,
    createPropertyWithId,
} from '../controllers/propertyController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';
import { uploadPropertyImages } from '../middleware/propertyImages.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Admin-only routes
router.post('/', isAuthenticated, isAdmin, createProperty);
router.put('/:id', isAuthenticated, isAdmin, updateProperty);
router.delete('/:id', isAuthenticated, isAdmin, deleteProperty);
router.get('/admin/stats', isAuthenticated, isAdmin, getPropertyStats);

router.post('/addproperty', isAuthenticated,uploadPropertyImages.array("images"),createPropertyWithId)

export default router;
