# Venezuela Intelligence Monitor - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **Redis** (v7 or higher)
- **npm** or **yarn**

## API Keys Required

You'll need to obtain API keys for the following services:

### Essential APIs
1. **OpenAI API** - For AI-powered content analysis and categorization
   - Get it at: https://platform.openai.com/api-keys
   
2. **NewsAPI** - For news aggregation
   - Get it at: https://newsapi.org/register
   
3. **Twitter API v2** - For Twitter monitoring
   - Get it at: https://developer.twitter.com/en/portal/dashboard

### Optional APIs (for full functionality)
4. **Facebook Graph API** - For Facebook monitoring
   - Get it at: https://developers.facebook.com/
   
5. **Telegram Bot API** - For Telegram monitoring
   - Create a bot: https://core.telegram.org/bots#creating-a-new-bot
   
6. **TikTok Research API** - For TikTok monitoring
   - Apply at: https://developers.tiktok.com/
   
7. **Google Cloud APIs** - For translation and news
   - Get it at: https://console.cloud.google.com/

## Installation Steps

### 1. Clone and Setup

```bash
cd josh-horch-project
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your API keys
# Use your preferred text editor
notepad .env  # Windows
```

**Important**: Fill in all the API keys in the `.env` file.

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Copy environment template
cp .env.example .env

# The default values should work for local development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### 5. Start Redis

Make sure Redis is running:

```bash
# Windows (if installed)
redis-server

# Or if using WSL
sudo service redis-server start
```

## Running the Application

### Development Mode

Open **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Features Overview

### Automated Monitoring
- Runs every 5 minutes to collect news from all platforms
- AI-powered categorization and analysis
- Real-time alerts for breaking news

### Daily Reports
- Generated automatically at 11 PM daily
- Comprehensive analysis and recommendations
- Newsletter-style formatting with images

### Real-Time Updates
- WebSocket connection for instant notifications
- Breaking news alerts
- Live dashboard updates

## Monitoring Platforms

The system monitors:
- **News Sites**: Via NewsAPI, Google News, RSS feeds
- **Twitter**: Hashtags, keywords, specific accounts
- **Facebook**: Pages and public posts
- **Telegram**: Public channels
- **TikTok**: Hashtags and trending videos
- **WhatsApp**: (Note: Requires manual setup for public groups)

## Customization

### Adding Keywords

Edit `backend/src/config/index.ts`:

```typescript
monitoring: {
  keywords: [
    'Venezuela',
    'Maduro',
    // Add your keywords here
  ],
}
```

### Adding Twitter Accounts to Monitor

Edit `backend/src/agents/twitterAgent.ts`:

```typescript
const defaultAccounts = [
  'NicolasMaduro',
  'jguaido',
  // Add account usernames here
];
```

### Adjusting Monitoring Frequency

Edit `backend/src/server.ts`:

```typescript
// Change from every 5 minutes to your preferred interval
cron.schedule('*/5 * * * *', async () => {
  // Monitoring code
});
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Default: `mongodb://localhost:27017/venezuela-monitor`

### Redis Connection Issues
- Ensure Redis is running
- Check the Redis URL in `.env`
- Default: `redis://localhost:6379`

### API Rate Limits
- Most APIs have rate limits
- The system includes error handling for rate limits
- Consider upgrading to paid API tiers for production use

### No Data Appearing
1. Check that all API keys are correctly set
2. Look at backend console for errors
3. Verify MongoDB and Redis are running
4. Check network connectivity

## Production Deployment

For production deployment:

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Set environment to production:**
```bash
# In backend/.env
NODE_ENV=production
```

3. **Use a process manager:**
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start dist/server.js --name venezuela-monitor

# Monitor
pm2 logs venezuela-monitor
```

4. **Set up a reverse proxy** (nginx/Apache) for the frontend
5. **Use environment variables** for sensitive data
6. **Set up SSL/TLS** certificates
7. **Configure firewall** rules

## Security Recommendations

1. **Never commit `.env` files** to version control
2. **Use strong API keys** and rotate them regularly
3. **Implement rate limiting** on your API endpoints
4. **Use HTTPS** in production
5. **Regularly update dependencies**
6. **Monitor logs** for suspicious activity

## Support

For issues or questions:
1. Check the logs in `backend/logs/`
2. Review the API documentation
3. Ensure all prerequisites are met
4. Verify API keys are valid

## License

MIT License - See LICENSE file for details
