import express from 'express';
import {
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertyStats,
    createPropertyWithId,
    getLanlordListings,
} from '../controllers/propertyController.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.middleware.js';
import { uploadPropertyImages } from '../middleware/propertyImages.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Admin-only routes
router.put('/:id', isAuthenticated, isAdmin, updateProperty);
router.delete('/:id', isAuthenticated, deleteProperty);
router.get('/admin/stats', isAuthenticated, isAdmin, getPropertyStats);


// landlords
router.post('/addproperty', isAuthenticated,uploadPropertyImages.array("images"),createPropertyWithId)
router.get('/landlord/listings',isAuthenticated,getLanlordListings)

export default router;
