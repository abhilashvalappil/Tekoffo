import mongoose, { Schema, Types } from 'mongoose';
import { IProposal } from '../interfaces/entities/IProposal';

const proposalSchema = new Schema<IProposal>({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  proposalType: {
    type: String,
    enum: ['freelancer-applied', 'client-invited'],
    default: 'freelancer-applied',
  },
  status: {
    type: String,
    enum: ['invited','pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  proposedBudget: {
    type: Number,
  },
  duration: {
    type: String,
  },
  attachments:{
    type:String,
    default:''
  },

  invitationMessage: {
    type: String,
    trim: true,
  },
  viewedByReceiver: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IProposal>('Proposal', proposalSchema);
