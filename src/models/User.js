// src/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Google login এ এটা null থাকবে
    image: { type: String, default: null },
    provider: { type: String, default: 'credentials' }, // "google" or "credentials"
    area: {
      type: String,
      default: '',
    },
    phone: { type: String, default: '' },
    nid: { type: String, default: '' },
    bio: {
      required: false,
      type: String,
      default: '',
    },
    otp: { type: String, default: null },
    otpexp: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: {
      type: String,
      enum: ["active", "warned", "banned"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model('User', UserSchema);