import axios from 'axios';
import { NewsItem, Alert, DailyReport } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsApi = {
  getNews: async (params?: {
    category?: string;
    platform?: string;
    limit?: number;
    page?: number;
    breaking?: boolean;
  }) => {
    const response = await api.get<{ success: boolean; data: NewsItem[] }>('/news', { params });
    return response.data.data;
  },

  getNewsById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: NewsItem }>(`/news/${id}`);
    return response.data.data;
  },

  searchNews: async (query: string, limit?: number) => {
    const response = await api.get<{ success: boolean; data: NewsItem[] }>('/news/search', {
      params: { q: query, limit },
    });
    return response.data.data;
  },
};

export const alertsApi = {
  getAlerts: async (params?: { limit?: number; unreadOnly?: boolean }) => {
    const response = await api.get<{ success: boolean; data: Alert[] }>('/alerts', { params });
    return response.data.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch<{ success: boolean; data: Alert }>(`/alerts/${id}/read`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get<{
      success: boolean;
      data: {
        total: number;
        unread: number;
        bySeverity: Array<{ _id: string; count: number }>;
      };
    }>('/alerts/stats');
    return response.data.data;
  },
};

export const reportsApi = {
  getDailyReport: async (date: string) => {
    const response = await api.get<{ success: boolean; data: DailyReport }>(
      `/reports/daily/${date}`
    );
    return response.data.data;
  },

  getRecentReports: async (limit?: number) => {
    const response = await api.get<{ success: boolean; data: DailyReport[] }>('/reports/recent', {
      params: { limit },
    });
    return response.data.data;
  },

  generateReport: async (date?: string) => {
    const response = await api.post<{ success: boolean; data: DailyReport }>('/reports/generate', {
      date,
    });
    return response.data.data;
  },
};

export default api;
