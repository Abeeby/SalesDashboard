import crypto from 'crypto';
import { LicenseManager } from './LicenseManager.mjs';

class ProductLicensing {
  constructor() {
    this.licenseManager = new LicenseManager();
    this.plans = {
      basic: {
        price: 9.99,
        features: ['basic_analytics', 'notifications']
      },
      pro: {
        price: 19.99,
        features: ['advanced_analytics', 'ai_optimization']
      },
      enterprise: {
        price: 49.99,
        features: ['all_features', 'priority_support']
      }
    };
  }

  async activateLicense(licenseKey) {
    const isValid = await this.licenseManager.validate(licenseKey);
    if (isValid) {
      const features = await this.licenseManager.getFeatures(licenseKey);
      return { success: true, features };
    }
    return { success: false, error: 'Invalid license key' };
  }

  async generateTrialLicense() {
    const trialKey = crypto.randomBytes(16).toString('hex');
    await this.licenseManager.createTrial(trialKey);
    return trialKey;
  }
} 