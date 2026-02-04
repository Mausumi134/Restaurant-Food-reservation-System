import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, "Table capacity must be at least 1"]
  },
  location: {
    type: String,
    enum: ["indoor", "outdoor", "private", "bar", "window"],
    default: "indoor"
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  amenities: [{
    type: String,
    enum: ["wheelchair_accessible", "high_chair", "booth", "round_table", "square_table"]
  }],
  pricePerHour: {
    type: Number,
    default: 0 // For premium tables
  },
  description: {
    type: String,
    maxLength: [200, "Description cannot exceed 200 characters"]
  }
}, {
  timestamps: true
});

export const Table = mongoose.model("Table", tableSchema);