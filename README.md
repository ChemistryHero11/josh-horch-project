# Venezuela Intelligence Monitor

A real-time monitoring and analysis platform for Venezuela-related news and social media activity across multiple platforms.

## Features

- **Multi-Platform Monitoring**: WhatsApp, Telegram, TikTok, Twitter, Facebook, and news sites
- **Real-Time Alerts**: Immediate notifications for breaking news
- **Daily Intelligence Reports**: Comprehensive end-of-day analysis
- **Categorized Intelligence**: 
  - Key Events
  - Political Updates
  - Economic Situation
  - Social Issues
  - Analysis & Trends
- **Professional Dashboard**: Designed for security and business professionals
- **Newsletter-Style Reports**: Visual reports with images and charts

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (for storing articles, alerts, reports)
- **Caching**: Redis (for real-time data)
- **Task Scheduling**: node-cron
- **AI/Analysis**: OpenAI GPT-4 API
- **Web Scraping**: Puppeteer, Cheerio

### Frontend
- **Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Query
- **Real-time Updates**: Socket.io
- **Charts**: Recharts

### APIs & Services
- **News**: NewsAPI, Google News API
- **Twitter**: Twitter API v2
- **Facebook**: Facebook Graph API
- **Telegram**: Telegram Bot API
- **TikTok**: TikTok Research API
- **Translation**: Google Translate API
- **Image Processing**: Sharp

## Project Structure

```
venezuela-monitor/
├── backend/
│   ├── src/
│   │   ├── agents/          # Monitoring agents for each platform
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx          # Main app component
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- API Keys (see Configuration section)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Configure environment variables (see `.env.example`)
5. Start MongoDB and Redis
6. Run the application:
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend
   cd frontend
   npm run dev
   ```

## Configuration

Create `.env` files in both backend and frontend directories with the following:

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/venezuela-monitor
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key
NEWS_API_KEY=your_newsapi_key
TWITTER_BEARER_TOKEN=your_twitter_token
FACEBOOK_ACCESS_TOKEN=your_facebook_token
TELEGRAM_BOT_TOKEN=your_telegram_token
TIKTOK_API_KEY=your_tiktok_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## API Documentation

### Endpoints

- `GET /api/alerts` - Get real-time alerts
- `GET /api/reports/daily/:date` - Get daily report
- `GET /api/news` - Get categorized news
- `GET /api/analytics` - Get analytics data
- `POST /api/alerts/subscribe` - Subscribe to alerts

## License

MIT
