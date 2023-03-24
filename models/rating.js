import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const ratingSchema = new mongoose.Schema({
  ratingId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: { type: Number, required: true },
  feedback: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Rating", ratingSchema);
