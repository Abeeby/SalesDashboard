import { WebSocketServer } from 'ws';
import { analyticsService } from './analytics.mjs';

class MonitoringService {
  constructor() {
    this.wss = new WebSocketServer({ port: 8080 });
    this.clients = new Set();
    this.init();
  }

  init() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      
      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });

    this.startMetricsCollection();
  }

  async startMetricsCollection() {
    setInterval(async () => {
      const metrics = await this.collectMetrics();
      this.broadcastMetrics(metrics);
    }, 5000);
  }

  broadcastMetrics(metrics) {
    const data = JSON.stringify({
      type: 'METRICS_UPDATE',
      data: metrics,
      timestamp: Date.now()
    });

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    }
  }

  async collectMetrics() {
    // Collecter diverses métriques
    const [systemMetrics, appMetrics, performanceMetrics] = await Promise.all([
      this.getSystemMetrics(),
      this.getAppMetrics(),
      this.getPerformanceMetrics()
    ]);

    return {
      system: systemMetrics,
      app: appMetrics,
      performance: performanceMetrics,
      timestamp: Date.now()
    };
  }
}

export const monitoringService = new MonitoringService(); 