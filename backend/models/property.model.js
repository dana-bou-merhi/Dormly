import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({

     title:    { type: String, required: true, trim: true },
    type:     { type: String, enum: ['Single Studio', 'Single Room', 'Double Shared Room', 'Apartment', 'Luxury Apartment', 'Modern Studio'],  },
    price:         { type: Number, required: true },
    baseRent:      { type: Number },
    utilities:     { type: Number },
    // price
    priceUnit:     { type: String, enum: ['month', 'bed', 'week'], default: 'month' },
    priceTrend:    { type: String, enum: ['up', 'down', 'stable'] },
    priceTrendPct: { type: Number },

    // ── Location ──
    location:    { type: String, required: true },
    distance:    { type: String },

    // ── Media ──
    image:  { type: String },
    images: [{ type: String }],

    // ── Availability ──
    status:        { type: String, enum: ['Available Now', 'Coming Soon', 'Full'], default: 'Available Now' },
    availability:  { type: String, enum: ['now', 'soon', 'full'] },
    availableFrom: { type: String },
    availableDate: { type: String },

    // ── Property Details ──
    furnishing:  { type: String, enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'] },
    description: { type: String },

    // ── Scores & Ratings ──
    rating:      { type: Number, min: 0, max: 5 },
    reviews:     { type: Number, default: 0 },
    dormlyScore: { type: Number, min: 0, max: 10 },
    rank:        { type: Number },

    // ── Amenities (card labels + detail icons in one) ──
    amenityLabels: [{ type: String }],        // ["24/7 Elec", "WiFi", "Furnished"] for home page
    amenities: [{ type: String }],       // ["24/7 Solar Panel 10A", "Fiber WiFi", "Air Conditioning"] — for detail page

    // student packages
    package: { type: String, default:'essential' },

    // ── Nearby Places ──
    nearbyAmenities: [
      {
        name:     { type: String },           // "Hamra Pharmacy"
        distance: { type: String },           // "2 min Walk"
      },
    ],

    // ── Landlord ──
    landlord: {
        user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        verified:     { type: Boolean, default: false },
        responseTime: { type: String, default: '' },
    },

    // ── Student Reviews ──
   /* studentReviews: [
      {
        author:    { type: String },
        rating:    { type: Number, min: 1, max: 5 },
        text:      { type: String },
        avatar:    { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],*/

},{ timestamps: true })

export const Property=mongoose.model('Property', propertySchema)