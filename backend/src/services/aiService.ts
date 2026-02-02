import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { NewsCategory, AlertSeverity } from '../types';

const genAI = new GoogleGenerativeAI(config.apis.gemini);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export class AIService {
  async categorizeContent(title: string, content: string): Promise<{
    category: NewsCategory;
    severity: AlertSeverity;
    isBreaking: boolean;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    entities: string[];
  }> {
    try {
      const prompt = `Analyze this Venezuela-related news content and provide structured categorization:

Title: ${title}
Content: ${content}

Provide a JSON response with:
1. category: one of [key_events, political, economic, social, analysis]
2. severity: one of [low, medium, high, critical]
3. isBreaking: boolean (true if urgent/breaking news)
4. summary: 2-3 sentence summary
5. sentiment: one of [positive, negative, neutral]
6. keywords: array of 5-10 relevant keywords
7. entities: array of people, organizations, locations mentioned

Consider:
- Key Events: Major developments, breaking news, significant incidents
- Political: Government actions, policy changes, international relations
- Economic: Economic indicators, trade, sanctions, oil production
- Social: Humanitarian issues, migration, protests, public sentiment
- Severity based on impact on security and business operations`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are an intelligence analyst specializing in Venezuela. Provide accurate, objective analysis for security and business professionals. Always respond with valid JSON only.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will provide intelligence analysis in JSON format.' }],
          },
        ],
      });

      const response = await chat.sendMessage(prompt);
      const text = response.response.text();
      const result = JSON.parse(text);
      return result;
    } catch (error) {
      console.error('AI categorization error:', error);
      return {
        category: NewsCategory.KEY_EVENTS,
        severity: AlertSeverity.LOW,
        isBreaking: false,
        summary: content.substring(0, 200) + '...',
        sentiment: 'neutral',
        keywords: [],
        entities: [],
      };
    }
  }

  async generateDailyAnalysis(newsItems: any[]): Promise<{
    summary: string;
    trends: string[];
    implications: string[];
    recommendations: string[];
  }> {
    try {
      const itemsSummary = newsItems.map((item, idx) => 
        `${idx + 1}. [${item.category}] ${item.title} - ${item.summary}`
      ).join('\n');

      const prompt = `Analyze today's Venezuela intelligence and provide executive summary for security and business professionals:

NEWS ITEMS (${newsItems.length} total):
${itemsSummary}

Provide JSON response with:
1. summary: Executive summary (3-4 paragraphs) of the day's developments
2. trends: Array of 5-7 key trends observed
3. implications: Array of 5-7 implications for security and business operations
4. recommendations: Array of 3-5 actionable recommendations

Focus on:
- Security risks and threats
- Business/operational impacts
- Political stability indicators
- Economic factors affecting operations
- Migration and humanitarian trends`;

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'You are a senior intelligence analyst providing daily briefings for security contractors, oil executives, shipping companies, and airlines operating in or around Venezuela. Always respond with valid JSON only.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'Understood. I will provide executive briefings in JSON format.' }],
          },
        ],
      });

      const response = await chat.sendMessage(prompt);
      const text = response.response.text();
      const result = JSON.parse(text);
      return result;
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        summary: 'Analysis temporarily unavailable.',
        trends: [],
        implications: [],
        recommendations: [],
      };
    }
  }

  async translateToEnglish(text: string): Promise<string> {
    try {
      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'Translate the following Spanish text to English. Preserve meaning and context. Only return the translation, nothing else.' }],
          },
          {
            role: 'model',
            parts: [{ text: 'I will translate Spanish to English accurately.' }],
          },
        ],
      });

      const response = await chat.sendMessage(text);
      return response.response.text();
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

export default new AIService();
