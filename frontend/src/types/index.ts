export enum NewsCategory {
  KEY_EVENTS = 'key_events',
  POLITICAL = 'political',
  ECONOMIC = 'economic',
  SOCIAL = 'social',
  ANALYSIS = 'analysis',
}

export enum SourcePlatform {
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  TELEGRAM = 'telegram',
  TIKTOK = 'tiktok',
  WHATSAPP = 'whatsapp',
  NEWS = 'news',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface NewsItem {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: NewsCategory;
  platform: SourcePlatform;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  imageUrl?: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  entities: string[];
  isBreaking: boolean;
  severity: AlertSeverity;
  createdAt: string;
}

export interface Alert {
  _id: string;
  newsItemId: NewsItem | string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: NewsCategory;
  timestamp: string;
  read: boolean;
  metadata: Record<string, any>;
}

export interface DailyReport {
  _id: string;
  date: string;
  summary: string;
  keyEvents: NewsItem[];
  politicalUpdates: NewsItem[];
  economicSituation: NewsItem[];
  socialIssues: NewsItem[];
  analysis: {
    trends: string[];
    implications: string[];
    recommendations: string[];
  };
  statistics: {
    totalItems: number;
    byPlatform: Record<SourcePlatform, number>;
    byCategory: Record<NewsCategory, number>;
    bySeverity: Record<AlertSeverity, number>;
  };
  generatedAt: string;
}
