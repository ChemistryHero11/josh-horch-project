import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    key_events: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    political: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    economic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    social: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    analysis: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    facebook: 'f',
    telegram: '✈',
    tiktok: '♪',
    whatsapp: '💬',
    news: '📰',
  };
  return icons[platform] || '📡';
}
