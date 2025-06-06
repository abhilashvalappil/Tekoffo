import mongoose, { Schema, Types } from 'mongoose';
import { IPlatformEarnings } from "../interfaces";

const PlatformEarningsSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  platformCommission: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IPlatformEarnings>('PlatformEarnings', PlatformEarningsSchema);
