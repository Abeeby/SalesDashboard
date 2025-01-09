import { createClient } from 'redis';
import { performance } from 'perf_hooks';

class AnalyticsService {
  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    this.init();
  }

  async init() {
    await this.redis.connect();
  }

  async trackMetric(type, value, metadata = {}) {
    const timestamp = Date.now();
    const key = `metrics:${type}:${timestamp}`;
    
    await this.redis.hSet(key, {
      value,
      timestamp,
      ...metadata
    });
    
    // Expire après 30 jours
    await this.redis.expire(key, 60 * 60 * 24 * 30);
  }

  async getPerformanceMetrics(itemId) {
    const views = await this.redis.get(`views:${itemId}`);
    const likes = await this.redis.get(`likes:${itemId}`);
    const visits = await this.redis.get(`visits:${itemId}`);
    
    return {
      views: parseInt(views) || 0,
      likes: parseInt(likes) || 0,
      visits: parseInt(visits) || 0,
      engagementRate: this.calculateEngagement(views, likes)
    };
  }

  calculateEngagement(views, likes) {
    if (!views || views === 0) return 0;
    return ((parseInt(likes) || 0) / parseInt(views)) * 100;
  }

  async generateReport(startDate, endDate) {
    const metrics = await this.redis.zRangeByScore(
      'metrics',
      startDate.getTime(),
      endDate.getTime()
    );

    return {
      totalViews: metrics.reduce((acc, m) => acc + m.views, 0),
      totalLikes: metrics.reduce((acc, m) => acc + m.likes, 0),
      averageEngagement: this.calculateAverageEngagement(metrics),
      peakTimes: this.analyzePeakTimes(metrics),
      recommendations: this.generateRecommendations(metrics)
    };
  }
}

export const analyticsService = new AnalyticsService(); 