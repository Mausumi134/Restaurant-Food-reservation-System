import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"]
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "debit_card", "paypal", "stripe", "cash", "digital_wallet"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
    default: "pending"
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true // allows multiple null values
  },
  paymentGateway: {
    type: String,
    enum: ["stripe", "paypal", "square", "cash"]
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Store gateway-specific response data
  },
  currency: {
    type: String,
    default: "USD"
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: {
    type: String
  },
  failureReason: {
    type: String
  },
  processedAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  }
}, {
  timestamps: true
});

export const Payment = mongoose.model("Payment", paymentSchema);