# API Integration Guide

This guide explains which APIs are needed and how to obtain them for the Venezuela Intelligence Monitor.

## Required APIs

### 1. OpenAI API (REQUIRED)
**Purpose**: AI-powered content analysis, categorization, translation, and report generation

**How to get it**:
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**Cost**: Pay-as-you-go, approximately $0.002 per 1K tokens
- Expected monthly cost: $20-50 for moderate usage

**Add to `.env`**:
```
OPENAI_API_KEY=sk-your-key-here
```

---

### 2. NewsAPI (REQUIRED)
**Purpose**: Aggregate news from thousands of sources worldwide

**How to get it**:
1. Go to https://newsapi.org/
2. Click "Get API Key"
3. Sign up for free account
4. Copy your API key

**Cost**: 
- Free tier: 100 requests/day
- Developer: $449/month for 250,000 requests

**Add to `.env`**:
```
NEWS_API_KEY=your-newsapi-key-here
```

---

### 3. Twitter API v2 (REQUIRED)
**Purpose**: Monitor tweets, hashtags, and specific accounts

**How to get it**:
1. Go to https://developer.twitter.com/
2. Sign up for a developer account
3. Create a new project and app
4. Navigate to "Keys and tokens"
5. Generate Bearer Token

**Cost**:
- Free tier: 500,000 tweets/month (read-only)
- Basic: $100/month for 10M tweets
- Pro: $5,000/month for 50M tweets

**Add to `.env`**:
```
TWITTER_BEARER_TOKEN=your-bearer-token-here
```

---

### 4. Facebook Graph API (OPTIONAL)
**Purpose**: Monitor Facebook pages and public posts

**How to get it**:
1. Go to https://developers.facebook.com/
2. Create a Facebook Developer account
3. Create a new app
4. Add "Facebook Login" product
5. Get your Access Token from Tools > Graph API Explorer

**Cost**: Free for basic usage

**Add to `.env`**:
```
FACEBOOK_ACCESS_TOKEN=your-access-token-here
```

**Note**: Facebook API has strict policies. You may need app review for certain permissions.

---

### 5. Telegram Bot API (OPTIONAL)
**Purpose**: Monitor public Telegram channels

**How to get it**:
1. Open Telegram and search for @BotFather
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the bot token provided

**Cost**: Free

**Add to `.env`**:
```
TELEGRAM_BOT_TOKEN=your-bot-token-here
```

**Setup**:
- Add your bot to the channels you want to monitor
- The bot needs to be an admin to read messages

---

### 6. TikTok Research API (OPTIONAL)
**Purpose**: Monitor TikTok videos and trends

**How to get it**:
1. Go to https://developers.tiktok.com/
2. Apply for Research API access
3. Wait for approval (can take weeks)
4. Get your API key from the dashboard

**Cost**: Free for research purposes (requires approval)

**Add to `.env`**:
```
TIKTOK_API_KEY=your-tiktok-key-here
```

**Note**: TikTok Research API requires academic or research credentials and approval.

---

### 7. Google Cloud APIs (OPTIONAL)
**Purpose**: Translation and additional news sources

**How to get it**:
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable the following APIs:
   - Cloud Translation API
   - Custom Search API (for Google News)
4. Create credentials (API Key)
5. Copy the API key

**Cost**:
- Translation: $20 per 1M characters
- Custom Search: Free for 100 queries/day, then $5 per 1,000 queries

**Add to `.env`**:
```
GOOGLE_TRANSLATE_API_KEY=your-google-key-here
GOOGLE_NEWS_API_KEY=your-google-key-here
```

---

## Minimum Setup (Budget-Friendly)

If you're on a tight budget, you can start with just these:

1. **OpenAI API** - Essential for analysis ($20-50/month)
2. **NewsAPI** - Free tier (100 requests/day)
3. **Twitter API** - Free tier (500K tweets/month)

This gives you:
- News monitoring from major sources
- Twitter monitoring
- AI-powered analysis and reports

**Estimated monthly cost**: $20-50

---

## Recommended Setup (Full Features)

For complete functionality:

1. OpenAI API ($20-50/month)
2. NewsAPI Developer ($449/month) OR use free tier
3. Twitter API Basic ($100/month) OR use free tier
4. Facebook Graph API (Free)
5. Telegram Bot API (Free)
6. Google Cloud APIs ($10-30/month)

**Estimated monthly cost**: $150-650 (depending on tier choices)

---

## API Usage Tips

### Rate Limiting
- The application includes built-in rate limiting
- APIs are called at intervals to avoid hitting limits
- Failed requests are logged but don't crash the system

### Cost Optimization
1. **Start with free tiers** and upgrade as needed
2. **Monitor usage** through each API's dashboard
3. **Adjust monitoring frequency** in `backend/src/server.ts`
4. **Filter keywords** to reduce unnecessary API calls

### Security Best Practices
1. **Never commit API keys** to version control
2. **Use environment variables** for all keys
3. **Rotate keys regularly**
4. **Set up billing alerts** on paid APIs
5. **Use separate keys** for development and production

---

## Alternative Free Options

If you can't afford paid APIs:

### News Sources
- Use RSS feeds directly (free)
- Scrape public news sites (check terms of service)
- Use Google News RSS (free, no API key needed)

### Social Media
- Twitter free tier is generous
- Telegram is completely free
- Facebook basic access is free

### Translation
- Use free translation libraries (less accurate)
- OpenAI can handle translation (included in analysis cost)

---

## Testing Your Setup

After adding API keys, test them:

```bash
cd backend
npm run dev
```

Check the console for:
- ✅ Successful API connections
- ❌ API errors or invalid keys
- ⚠️ Rate limit warnings

---

## Getting Help

If you encounter issues:

1. **Check API documentation** for the specific service
2. **Verify API key format** (no extra spaces, correct prefix)
3. **Check billing status** (some APIs require payment method)
4. **Review rate limits** in API dashboard
5. **Check application logs** in `backend/logs/`

---

## API Comparison Table

| API | Cost | Difficulty | Required | Purpose |
|-----|------|-----------|----------|---------|
| OpenAI | $20-50/mo | Easy | ✅ Yes | AI Analysis |
| NewsAPI | Free-$449/mo | Easy | ✅ Yes | News |
| Twitter | Free-$100/mo | Medium | ✅ Yes | Social Media |
| Facebook | Free | Medium | ⚠️ Optional | Social Media |
| Telegram | Free | Easy | ⚠️ Optional | Social Media |
| TikTok | Free* | Hard | ⚠️ Optional | Social Media |
| Google | $10-30/mo | Easy | ⚠️ Optional | Translation |

*Requires research approval
