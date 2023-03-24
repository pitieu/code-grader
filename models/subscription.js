import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "suspended", "expired"],
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
  nextBillingDate: {
    type: Date,
  },
  paymentHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
});

export default mongoose.model("Subscription", subscriptionSchema);
