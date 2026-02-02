import mongoose, { Schema, Document } from 'mongoose';
import { NewsCategory, SourcePlatform, AlertSeverity } from '../types';

export interface IDailyReport extends Document {
  date: Date;
  summary: string;
  keyEvents: mongoose.Types.ObjectId[];
  politicalUpdates: mongoose.Types.ObjectId[];
  economicSituation: mongoose.Types.ObjectId[];
  socialIssues: mongoose.Types.ObjectId[];
  analysis: {
    trends: string[];
    implications: string[];
    recommendations: string[];
  };
  statistics: {
    totalItems: number;
    byPlatform: Map<SourcePlatform, number>;
    byCategory: Map<NewsCategory, number>;
    bySeverity: Map<AlertSeverity, number>;
  };
  generatedAt: Date;
}

const DailyReportSchema: Schema = new Schema({
  date: { type: Date, required: true, unique: true },
  summary: { type: String, required: true },
  keyEvents: [{ type: Schema.Types.ObjectId, ref: 'NewsItem' }],
  politicalUpdates: [{ type: Schema.Types.ObjectId, ref: 'NewsItem' }],
  economicSituation: [{ type: Schema.Types.ObjectId, ref: 'NewsItem' }],
  socialIssues: [{ type: Schema.Types.ObjectId, ref: 'NewsItem' }],
  analysis: {
    trends: [{ type: String }],
    implications: [{ type: String }],
    recommendations: [{ type: String }],
  },
  statistics: {
    totalItems: { type: Number, required: true },
    byPlatform: { type: Map, of: Number },
    byCategory: { type: Map, of: Number },
    bySeverity: { type: Map, of: Number },
  },
  generatedAt: { type: Date, default: Date.now },
});

DailyReportSchema.index({ date: -1 });

export default mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);
