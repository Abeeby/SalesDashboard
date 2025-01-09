import { WebPush } from 'web-push';
import { createTransport } from 'nodemailer';
import { Telegram } from 'telegraf';
import { analyticsService } from './analytics.mjs';

class NotificationService {
  constructor() {
    this.webpush = new WebPush({
      vapidKeys: {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
      }
    });

    this.emailTransport = createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
    this.notificationQueue = new Map();
  }

  async sendAlert(type, data, channels = ['email', 'push', 'telegram']) {
    const notification = this.formatNotification(type, data);
    
    await Promise.all([
      channels.includes('email') && this.sendEmail(notification),
      channels.includes('push') && this.sendPushNotification(notification),
      channels.includes('telegram') && this.sendTelegramMessage(notification)
    ]);

    await analyticsService.trackMetric('notification_sent', {
      type,
      channels,
      timestamp: Date.now()
    });
  }

  async monitorSales() {
    setInterval(async () => {
      const alerts = await this.checkSalesAlerts();
      for (const alert of alerts) {
        await this.sendAlert('sale', alert);
      }
    }, 60000); // Vérifier toutes les minutes
  }

  async monitorPrices() {
    setInterval(async () => {
      const priceAlerts = await this.checkPriceAlerts();
      for (const alert of priceAlerts) {
        await this.sendAlert('price_change', alert);
      }
    }, 300000); // Vérifier toutes les 5 minutes
  }
}

export const notificationService = new NotificationService(); 