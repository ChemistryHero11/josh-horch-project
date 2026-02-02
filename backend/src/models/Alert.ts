import mongoose, { Schema, Document } from 'mongoose';
import { NewsCategory, AlertSeverity } from '../types';

export interface IAlert extends Document {
  newsItemId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: NewsCategory;
  timestamp: Date;
  read: boolean;
  metadata: Record<string, any>;
}

const AlertSchema: Schema = new Schema({
  newsItemId: { 
    type: Schema.Types.ObjectId, 
    ref: 'NewsItem',
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { 
    type: String, 
    enum: Object.values(AlertSeverity),
    required: true 
  },
  category: { 
    type: String, 
    enum: Object.values(NewsCategory),
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  metadata: { type: Map, of: Schema.Types.Mixed },
});

AlertSchema.index({ timestamp: -1 });
AlertSchema.index({ read: 1, timestamp: -1 });
AlertSchema.index({ severity: 1, timestamp: -1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);
