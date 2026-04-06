import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    anonymous: { type: Boolean, required: true, default: false },
    ticketId: { type: String, index: true },
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    severity: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    district: { type: String },
    upazila: { type: String },
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    gpsGranted: { type: Boolean, default: false },
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos: { type: [String], default: [] },
    vote: { type: Number, default: 0 },
    voters: { type: [String], default: [] },
    status: { 
      type: String, 
      enum: ["pending", "in_review", "action_taken", "resolved"],
      default: "pending" 
    },
    adminFeedback: { type: String, default: "" },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        comment: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
