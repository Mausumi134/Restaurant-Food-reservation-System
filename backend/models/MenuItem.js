import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: [100, "Menu item name cannot exceed 100 characters"]
  },
  description: {
    type: String,
    required: true,
    maxLength: [500, "Description cannot exceed 500 characters"]
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"]
  },
  category: {
    type: String,
    required: true,
    enum: ["Breakfast", "Lunch", "Dinner", "Beverages", "Desserts", "Appetizers"]
  },
  image: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  ingredients: [{
    type: String
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  spiceLevel: {
    type: String,
    enum: ["Mild", "Medium", "Hot", "Extra Hot"],
    default: "Mild"
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isNewItem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);