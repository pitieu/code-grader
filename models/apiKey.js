import mongoose from "mongoose";
import { nanoid } from "nanoid";

export const apiKeySchema = new mongoose.Schema({
  apiKeyId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("ApiKey", apiKeySchema);
