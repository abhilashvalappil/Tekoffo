import {Document, Types } from 'mongoose';

export interface IPlatformEarnings extends Document {
  jobId: Types.ObjectId;
  clientId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  platformCommission?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
