import { Router } from 'express';
import Alert from '../models/Alert';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50, unreadOnly = false } = req.query;
    
    const query: any = {};
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const alerts = await Alert.find(query)
      .populate('newsItemId')
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts',
    });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found',
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update alert',
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const total = await Alert.countDocuments();
    const unread = await Alert.countDocuments({ read: false });
    const bySeverity = await Alert.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        total,
        unread,
        bySeverity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert stats',
    });
  }
});

export default router;
