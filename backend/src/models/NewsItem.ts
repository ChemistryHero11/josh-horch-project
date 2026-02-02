import mongoose, { Schema, Document } from 'mongoose';
import { NewsCategory, SourcePlatform, AlertSeverity } from '../types';

export interface INewsItem extends Document {
  title: string;
  content: string;
  summary: string;
  category: NewsCategory;
  platform: SourcePlatform;
  sourceUrl: string;
  sourceName: string;
  publishedAt: Date;
  imageUrl?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  entities: string[];
  isBreaking: boolean;
  severity: AlertSeverity;
  createdAt: Date;
}

const NewsItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  category: { 
    type: String, 
    enum: Object.values(NewsCategory),
    required: true 
  },
  platform: { 
    type: String, 
    enum: Object.values(SourcePlatform),
    required: true 
  },
  sourceUrl: { type: String, required: true },
  sourceName: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  imageUrl: { type: String },
  sentiment: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  keywords: [{ type: String }],
  entities: [{ type: String }],
  isBreaking: { type: Boolean, default: false },
  severity: { 
    type: String, 
    enum: Object.values(AlertSeverity),
    default: AlertSeverity.LOW
  },
  createdAt: { type: Date, default: Date.now },
});

NewsItemSchema.index({ publishedAt: -1 });
NewsItemSchema.index({ category: 1, publishedAt: -1 });
NewsItemSchema.index({ platform: 1, publishedAt: -1 });
NewsItemSchema.index({ isBreaking: 1, publishedAt: -1 });

export default mongoose.model<INewsItem>('NewsItem', NewsItemSchema);
