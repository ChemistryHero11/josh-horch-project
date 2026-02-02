import { Router } from 'express';
import NewsItem from '../models/NewsItem';
import { NewsCategory, SourcePlatform } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const {
      category,
      platform,
      limit = 50,
      page = 1,
      breaking = false,
    } = req.query;

    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (platform) {
      query.platform = platform;
    }
    
    if (breaking === 'true') {
      query.isBreaking = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const newsItems = await NewsItem.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await NewsItem.countDocuments(query);

    res.json({
      success: true,
      data: newsItems,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news items',
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const newsItem = await NewsItem.findById(req.params.id);

    if (!newsItem) {
      return res.status(404).json({
        success: false,
        error: 'News item not found',
      });
    }

    res.json({
      success: true,
      data: newsItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news item',
    });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, limit = 50 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
      });
    }

    const newsItems = await NewsItem.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q as string, 'i')] } },
      ],
    })
      .sort({ publishedAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: newsItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
    });
  }
});

export default router;
