import { Property } from '../models/property.model.js';

// ─── GET ALL PROPERTIES (with search + filter + pagination)
export const getProperties = async (req, res) => {
    try {
        const {search, status, type, minPrice, maxPrice, location,   page = 1, limit = 10,  } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (status) filter.status = status;
        if (type) filter.type = type;
        if (location) filter.location = { $regex: location, $options: 'i' };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Property.countDocuments(filter);
        const properties = await Property.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: properties.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            properties,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch properties.' });
    }
};

// ─── GET SINGLE PROPERTY 
export const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("landlord.user", "username email profilePicture");
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.status(200).json({ success: true, property });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch property.' });
    }
};


//UPDATE PROPERTY (Admin)
export const updateProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }

        res.status(200).json({ success: true, message: 'Property updated successfully.', property });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update property.' });
    }
};


export const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found.' });
        }
        res.status(200).json({ success: true, message: 'Property deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete property.' });
    }
};

// ADMIN DASHBOARD STATS 
export const getPropertyStats = async (req, res) => {
    try {
        const [total, available, comingSoon, full] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ status: 'Available Now' }),
            Property.countDocuments({ status: 'Coming Soon' }),
            Property.countDocuments({ status: 'Full' }),
        ]);

        const priceAgg = await Property.aggregate([
            { $group: { _id: null, avgPrice: { $avg: '$price' }, maxPrice: { $max: '$price' }, minPrice: { $min: '$price' } } },
        ]);

        const byType = await Property.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const recentListings = await Property.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title location price status createdAt image');

        res.status(200).json({
            success: true,
            stats: {
                total,
                available,
                comingSoon,
                full,
                avgPrice: priceAgg[0]?.avgPrice?.toFixed(2) || 0,
                maxPrice: priceAgg[0]?.maxPrice || 0,
                minPrice: priceAgg[0]?.minPrice || 0,
                byType,
                recentListings,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
    }
};


// add property with id of user creating it 

export const createPropertyWithId = async (req, res) => {
    try {
        const user = req.user; 
        if (!user) return res.status(401).json({ message: "Unauthorized" });

        if (user.role !== "landlord" && user.role!=="admin") {
            return res.status(403).json({ message: "Only landlords can add properties." });
        }

       // const amenities       = req.body.amenities ? JSON.parse(req.body.amenities) : [];
       
        const amenityLabels   = req.body.amenityLabels ? JSON.parse(req.body.amenityLabels) : [];
        const nearbyAmenities = req.body.nearbyAmenities ? JSON.parse(req.body.nearbyAmenities) : [];
        const amenities = amenityLabels.slice(0, 3);

        const baseUrl = `${req.protocol}://${req.get("host")}`; // e.g., http://localhost:8002

    const images = req.files?.map(file => `${baseUrl}/uploads/properties/${file.filename}`) || [];
    const image = images[0] || ""; // first image as main cover

          
   // console.log('Body:', req.body); 

        const property = await Property.create({
            title:        req.body.title,
            description:  req.body.description,
            type:         req.body.type,
            status:       req.body.status,
            furnishing:   req.body.furnishing,
            location:     req.body.location,
            distance:     req.body.distance,
            price:        req.body.price,
            baseRent:     req.body.baseRent,
            utilities:    req.body.utilities,
            package:      req.body.packageType,
            reviews:      req.body.reviews || 0,
            rank:         req.body.rank || 0,
            dormlyScore:  req.body.dormlyScore || 8,
            priceUnit:    req.body.priceUnit || 'month',
            availableFrom: req.body.availableFrom || '',
            rating: req.body.rating || 0,
            amenities,
            amenityLabels,
            nearbyAmenities,
            images,
            image,
            landlord: {
                user: user._id,
                verified: false,
                responseTime: req.body.responseTime || "",
            },
        });

        return res.status(201).json({ success: true, property });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// get lanlord data 
export const getLanlordListings = async (req, res) => {
  try {
    const userId = req.user._id;

    const properties = await Property.find({
      "landlord.user": userId
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};