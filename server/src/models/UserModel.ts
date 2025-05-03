
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/entities/IUser';

const UserSchema: Schema<IUser> = new Schema({
  username: { 
    type: String,
     required: true,
      unique: true 
    },
  email: { 
    type: String, 
    required: true,
     unique: true 
    },
  password: { 
    type: String 
  },
  role: { 
    type: String,
     enum: ['freelancer', 'client', 'admin'],
      required: true
     },
  fullName: {
     type: String,
      default: ''
     }, 
  companyName: { 
    type: String,
     default: ''
     },
  description: { 
    type: String, 
    default: '' 
  },
  profilePicture: {
     type: String, 
     default: '' 
    },
  country: {
     type: String,
      default: '' 
    }, 
  skills: { 
    type: [String], 
    default: []
   },
  preferredJobFields: { 
    type: [String], 
    default: [] 
  },
  total_Earnings: { 
    type: Number,
     default: 0
     },
  total_Spent: {
     type: Number, 
     default: 0
     },
  googleId: { 
    type: String,
     unique: true, 
     sparse: true 
    },
  linkedinUrl: {
    type: String, 
    default: ''
  },
  githubUrl: {
    type: String,
     default: ''
    },
  portfolioUrl: {
    type: String,
     default: ''
    },
  isGoogleAuth: {
     type: Boolean, 
     default: false 
    },
  isBlocked: {
     type: Boolean,
      default: false 
    },
    stripeAccountId: {
      type:String,
      default: ''
    }
},{
  timestamps: true,
}
);

export default mongoose.model<IUser>('User', UserSchema);