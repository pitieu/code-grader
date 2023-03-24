import mongoose from 'mongoose'
import { nanoid } from 'nanoid'

export const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    default: () => nanoid(10),
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'refunded', 'failed'],
    required: true,
  },
})

export default mongoose.model('Payment', paymentSchema)
