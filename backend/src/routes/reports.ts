import { Router } from 'express';
import reportService from '../services/reportService';
import { parseISO } from 'date-fns';

const router = Router();

router.get('/daily/:date', async (req, res) => {
  try {
    const date = parseISO(req.params.date);
    const report = await reportService.getReport(date);

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found for this date',
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report',
    });
  }
});

router.get('/recent', async (req, res) => {
  try {
    const { limit = 7 } = req.query;
    const reports = await reportService.getRecentReports(Number(limit));

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent reports',
    });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { date } = req.body;
    const reportDate = date ? parseISO(date) : new Date();
    
    const report = await reportService.generateDailyReport(reportDate);

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
    });
  }
});

export default router;
