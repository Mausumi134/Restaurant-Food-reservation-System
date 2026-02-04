import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" }, // Home, Work, Other
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "USA" },
  coordinates: {
    type: [Number] // [longitude, latitude]
  },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "First name cannot exceed 50 characters"]
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: [50, "Last name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [3, "Username must be at least 3 characters"],
    maxLength: [30, "Username cannot exceed 30 characters"]
  },
  password: {
    type: String,
    required: true,
    minLength: [6, "Password must be at least 6 characters"]
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: "Please provide a valid phone number"
    }
  },
  role: {
    type: String,
    enum: ["customer"],
    default: "customer"
  },
  addresses: [addressSchema],
  preferences: {
    cuisineTypes: [String],
    dietaryRestrictions: [String], // vegetarian, vegan, gluten-free, etc.
    spiceLevel: {
      type: String,
      enum: ["Mild", "Medium", "Hot", "Extra Hot"],
      default: "Medium"
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String
  },
  // For delivery drivers
  driverInfo: {
    licenseNumber: String,
    vehicleType: String,
    vehicleNumber: String,
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
      type: [Number] // [longitude, latitude]
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('User', userSchema);

export default User;
