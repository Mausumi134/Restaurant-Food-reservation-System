import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name must be of at least 3 Characters."],
    maxLength: [30, "First name cannot exceed 30 Characters."],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be of at least 3 Characters."],
    maxLength: [30, "Last name cannot exceed 30 Characters."],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Provide a valid email"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [10, "Phone number must contain 10 Digits."],
    maxLength: [15, "Phone number cannot exceed 15 Digits."],
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  partySize: {
    type: Number,
    required: true,
    min: [1, "Party size must be at least 1"],
    max: [20, "Party size cannot exceed 20"]
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table"
  },
  duration: {
    type: Number, // in hours
    default: 2
  },
  specialRequests: {
    type: String,
    maxLength: [500, "Special requests cannot exceed 500 characters"]
  },
  occasion: {
    type: String,
    enum: ["birthday", "anniversary", "date", "business", "family", "celebration", "other"],
    default: "other"
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no_show"],
    default: "pending"
  },
  preOrderItems: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem"
    },
    quantity: Number,
    specialInstructions: String
  }],
  totalAmount: {
    type: Number,
    default: 0
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "deposit_paid", "fully_paid", "refunded"],
    default: "pending"
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  checkInTime: Date,
  checkOutTime: Date
}, {
  timestamps: true
});

// Index for efficient queries
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ customer: 1 });
reservationSchema.index({ table: 1, date: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema);
