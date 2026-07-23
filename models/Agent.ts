import mongoose, { Schema, Document } from 'mongoose';
import { AGENT_CATEGORIES, AgentCategory } from '@/types';

export interface IAgent extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: AgentCategory;
  pricingModel: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      enum: AGENT_CATEGORIES,
    },
    pricingModel: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Agent || mongoose.model<IAgent>('Agent', AgentSchema);
