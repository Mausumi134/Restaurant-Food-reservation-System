import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"]
  },
  price: {
    type: Number,
    required: true
  },
  specialInstructions: {
    type: String,
    maxLength: [200, "Special instructions cannot exceed 200 characters"]
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  orderType: {
    type: String,
    enum: ["delivery", "pickup", "dine-in"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  tip: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: "USA" },
    coordinates: {
      type: [Number] // [longitude, latitude]
    },
    deliveryInstructions: String
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  scheduledFor: {
    type: Date // for scheduled orders
  },
  customerNotes: {
    type: String,
    maxLength: [300, "Customer notes cannot exceed 300 characters"]
  },
  restaurantNotes: {
    type: String,
    maxLength: [300, "Restaurant notes cannot exceed 300 characters"]
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table" // For dine-in orders
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation" // Link to reservation if applicable
  }
}, {
  timestamps: true
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export const Order = mongoose.model("Order", orderSchema);