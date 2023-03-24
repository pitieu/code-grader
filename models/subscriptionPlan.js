import mongoose from "mongoose";

export const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  maxRequestsPerDay: {
    type: Number,
    default: 0,
  },
  maxRequestsPerMonth: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
