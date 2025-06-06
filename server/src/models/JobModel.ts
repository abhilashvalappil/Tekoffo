import mongoose, { Schema, Types } from 'mongoose';
import { JobDataType } from '../interfaces/entities/IJob';

const JobSchema: Schema<JobDataType> = new Schema({
  clientId: {
     type: Schema.Types.ObjectId,
      required: true,
       ref: 'User' 
      },
  title: { 
    type: String,
     required: true 
    },
  category: {
     type: String, 
     required: true 
    },
  subCategory: { 
    type: String, 
    required: true
   },
  description: { 
    type: String, 
    required: true
   },
  requirements: {
     type: [String], 
     required: true
     }, 
  budget: {
     type: Number, 
     required: true
     },
  duration: { 
    type: String,
     required: true
     },
  status: {
    type: String,
    enum: ['open', 'inprogress', 'completed'],
    default: 'open'
  },
  isBlocked: {
     type: Boolean,
      default: false
     },
},{
   timestamps: true,
 });

export default mongoose.model<JobDataType>('Job', JobSchema);
