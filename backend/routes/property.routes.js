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
import { isAuthenticated, isAdmin, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadPropertyImages } from '../middleware/propertyImages.js';

const router = express.Router();
// old good working route 
//router.get('/', getProperties);


// instead of the above try this

 router.get('/', optionalAuth, getProperties);



router.get('/:id', getPropertyById);

// Admin-only routes
router.put('/updateproperty/:id', isAuthenticated,uploadPropertyImages.array('images'), updateProperty);

router.delete('/:id', isAuthenticated, deleteProperty);
router.get('/admin/stats', isAuthenticated, isAdmin, getPropertyStats);


// landlords
router.post('/addproperty', isAuthenticated,uploadPropertyImages.array("images"),createPropertyWithId)
router.get('/landlord/listings',isAuthenticated,getLanlordListings)

export default router;
