import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: false,
  },
  apiKeys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema);
