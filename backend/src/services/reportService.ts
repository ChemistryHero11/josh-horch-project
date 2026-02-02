import { startOfDay, endOfDay } from 'date-fns';
import NewsItem from '../models/NewsItem';
import DailyReport from '../models/DailyReport';
import aiService from './aiService';
import { NewsCategory, SourcePlatform, AlertSeverity } from '../types';

export class ReportService {
  async generateDailyReport(date: Date = new Date()): Promise<any> {
    console.log(`Generating daily report for ${date.toDateString()}...`);

    const startDate = startOfDay(date);
    const endDate = endOfDay(date);

    const newsItems = await NewsItem.find({
      publishedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ publishedAt: -1 });

    if (newsItems.length === 0) {
      console.log('No news items found for this date.');
      return null;
    }

    const keyEvents = newsItems.filter(
      item => item.category === NewsCategory.KEY_EVENTS
    );
    const politicalUpdates = newsItems.filter(
      item => item.category === NewsCategory.POLITICAL
    );
    const economicSituation = newsItems.filter(
      item => item.category === NewsCategory.ECONOMIC
    );
    const socialIssues = newsItems.filter(
      item => item.category === NewsCategory.SOCIAL
    );

    const analysis = await aiService.generateDailyAnalysis(
      newsItems.map(item => ({
        title: item.title,
        summary: item.summary,
        category: item.category,
        severity: item.severity,
      }))
    );

    const statistics = this.calculateStatistics(newsItems);

    const report = new DailyReport({
      date: startDate,
      summary: analysis.summary,
      keyEvents: keyEvents.slice(0, 10).map(item => item._id),
      politicalUpdates: politicalUpdates.slice(0, 10).map(item => item._id),
      economicSituation: economicSituation.slice(0, 10).map(item => item._id),
      socialIssues: socialIssues.slice(0, 10).map(item => item._id),
      analysis: {
        trends: analysis.trends,
        implications: analysis.implications,
        recommendations: analysis.recommendations,
      },
      statistics,
    });

    await report.save();

    console.log(`Daily report generated with ${newsItems.length} items.`);

    return report.populate([
      'keyEvents',
      'politicalUpdates',
      'economicSituation',
      'socialIssues',
    ]);
  }

  private calculateStatistics(newsItems: any[]): any {
    const byPlatform = new Map<SourcePlatform, number>();
    const byCategory = new Map<NewsCategory, number>();
    const bySeverity = new Map<AlertSeverity, number>();

    for (const item of newsItems) {
      byPlatform.set(
        item.platform,
        (byPlatform.get(item.platform) || 0) + 1
      );
      byCategory.set(
        item.category,
        (byCategory.get(item.category) || 0) + 1
      );
      bySeverity.set(
        item.severity,
        (bySeverity.get(item.severity) || 0) + 1
      );
    }

    return {
      totalItems: newsItems.length,
      byPlatform,
      byCategory,
      bySeverity,
    };
  }

  async getReport(date: Date): Promise<any> {
    const startDate = startOfDay(date);
    
    const report = await DailyReport.findOne({ date: startDate }).populate([
      'keyEvents',
      'politicalUpdates',
      'economicSituation',
      'socialIssues',
    ]);

    return report;
  }

  async getRecentReports(limit: number = 7): Promise<any[]> {
    const reports = await DailyReport.find()
      .sort({ date: -1 })
      .limit(limit)
      .populate([
        'keyEvents',
        'politicalUpdates',
        'economicSituation',
        'socialIssues',
      ]);

    return reports;
  }
}

export default new ReportService();
