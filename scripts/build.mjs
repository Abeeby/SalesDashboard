import { build } from 'electron-builder';
import { execSync } from 'child_process';
import { version } from '../package.json';

async function buildApp() {
  // Build React
  console.log('🏗️ Building React application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build Electron
  console.log('🚀 Building desktop applications...');
  await build({
    config: {
      appId: 'com.vintedmanager.app',
      productName: 'Vinted Manager Pro',
      copyright: 'Copyright © 2025',
      directories: {
        output: 'dist',
        buildResources: 'assets'
      },
      // Configuration Windows
      win: {
        target: ['nsis'],
        icon: 'assets/icons/win/icon.ico',
        certificateFile: process.env.WIN_CSC_LINK,
        certificatePassword: process.env.WIN_CSC_KEY_PASSWORD
      },
      // Configuration Mac
      mac: {
        target: ['dmg'],
        icon: 'assets/icons/mac/icon.icns',
        category: 'public.app-category.business'
      },
      // Configuration Linux
      linux: {
        target: ['AppImage', 'deb'],
        category: 'Office'
      },
      // Mise à jour automatique
      publish: {
        provider: 's3',
        bucket: 'vintedmanager-releases'
      }
    }
  });
}

buildApp().catch(console.error); 