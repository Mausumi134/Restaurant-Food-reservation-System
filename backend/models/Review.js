import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"]
  },
  comment: {
    type: String,
    maxLength: [500, "Review comment cannot exceed 500 characters"]
  },
  foodRating: {
    type: Number,
    min: [1, "Food rating must be at least 1"],
    max: [5, "Food rating cannot exceed 5"]
  },
  serviceRating: {
    type: Number,
    min: [1, "Service rating must be at least 1"],
    max: [5, "Service rating cannot exceed 5"]
  },
  deliveryRating: {
    type: Number,
    min: [1, "Delivery rating must be at least 1"],
    max: [5, "Delivery rating cannot exceed 5"]
  },
  images: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  restaurantResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
}, {
  timestamps: true
});

// Ensure one review per customer per order
reviewSchema.index({ customer: 1, order: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);