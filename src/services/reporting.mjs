import { jsPDF } from 'jspdf';
import { ExcelJS } from 'exceljs';
import { analyticsService } from './analytics.mjs';
import { optimizationService } from './optimization.mjs';

class ReportingService {
  constructor() {
    this.reportTemplates = new Map();
    this.loadTemplates();
  }

  async generateDailyReport() {
    const data = await this.collectDailyData();
    const insights = await optimizationService.generateInsights(data);
    
    return {
      pdf: await this.generatePDFReport(data, insights),
      excel: await this.generateExcelReport(data, insights),
      json: this.generateJSONReport(data, insights)
    };
  }

  async generateWeeklyAnalysis() {
    const weekData = await analyticsService.getWeeklyData();
    const trends = await this.analyzeTrends(weekData);
    
    return {
      performance: this.analyzePerformance(weekData),
      recommendations: await this.generateRecommendations(trends),
      forecast: await this.generateForecast(weekData)
    };
  }

  async scheduleReports(config) {
    // Configuration des rapports automatiques
    const schedule = new Map([
      ['daily', '0 0 * * *'],
      ['weekly', '0 0 * * 0'],
      ['monthly', '0 0 1 * *']
    ]);

    for (const [type, cron] of schedule) {
      if (config[type]) {
        this.scheduleCronJob(cron, async () => {
          const report = await this.generateReport(type);
          await this.distributeReport(report, config[type].recipients);
        });
      }
    }
  }
}

export const reportingService = new ReportingService(); 