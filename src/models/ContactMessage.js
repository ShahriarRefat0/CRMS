import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema(
  {
    anonymous: { type: Boolean, required: true, default: false },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    type: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
