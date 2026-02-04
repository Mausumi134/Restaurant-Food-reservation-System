import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, "Restaurant name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    maxLength: [1000, "Description cannot exceed 1000 characters"]
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: "USA" }
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
  cuisineType: [{
    type: String,
    enum: ["Italian", "Chinese", "Indian", "Mexican", "American", "Thai", "Japanese", "Mediterranean", "French", "Other"]
  }],
  deliveryRadius: {
    type: Number, // in kilometers
    default: 10
  },
  deliveryFee: {
    type: Number,
    default: 5.99
  },
  minimumOrderAmount: {
    type: Number,
    default: 15.00
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
restaurantSchema.index({ location: "2dsphere" });

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);