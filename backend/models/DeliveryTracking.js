import mongoose from "mongoose";

const deliveryTrackingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
    unique: true
  },
  driver: {
    name: String,
    phone: String,
    vehicleType: String,
    vehicleNumber: String,
    photo: String
  },
  status: {
    type: String,
    enum: ["assigned", "picked_up", "on_the_way", "nearby", "delivered"],
    default: "assigned"
  },
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  actualDeliveryTime: {
    type: Date
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  deliveryRoute: [{
    latitude: Number,
    longitude: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deliveryInstructions: String,
  deliveryNotes: String,
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  deliveryFeedback: String,
  deliveryPhotos: [String], // Photos of delivered order
  isContactlessDelivery: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const DeliveryTracking = mongoose.model("DeliveryTracking", deliveryTrackingSchema);