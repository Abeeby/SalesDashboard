import { app } from 'electron';
import { autoUpdater } from 'electron-updater';
import pkg from '../../package.json';

const DEPLOYMENT_CONFIGS = {
  desktop: {
    platforms: ['win', 'mac', 'linux'],
    builds: {
      win: {
        target: 'nsis',
        arch: ['x64', 'ia32'],
        icon: 'assets/icons/win/icon.ico',
        installerIcon: 'assets/icons/win/setup.ico'
      },
      mac: {
        target: 'dmg',
        arch: ['x64', 'arm64'],
        icon: 'assets/icons/mac/icon.icns'
      },
      linux: {
        target: ['AppImage', 'deb', 'rpm'],
        icon: 'assets/icons/linux'
      }
    }
  },
  web: {
    hosting: ['firebase', 'vercel'],
    domains: ['app.vintedmanager.com']
  },
  mobile: {
    platforms: ['android', 'ios'],
    stores: ['playstore', 'appstore']
  }
}; 