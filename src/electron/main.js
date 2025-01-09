import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import isDev from 'electron-is-dev';
import Store from 'electron-store';

class VintedManagerApp {
  constructor() {
    this.window = null;
    this.store = new Store();
    this.initApp();
  }

  async initApp() {
    await app.whenReady();
    this.createWindow();
    this.setupUpdater();
    this.setupIPC();
  }

  createWindow() {
    this.window = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      frame: false, // Interface personnalisée
      titleBarStyle: 'hidden'
    });

    // Charger l'application
    this.window.loadURL(
      isDev 
        ? 'http://localhost:3000' 
        : `file://${path.join(__dirname, '../build/index.html')}`
    );
  }

  setupUpdater() {
    autoUpdater.checkForUpdatesAndNotify();
    
    autoUpdater.on('update-available', () => {
      this.window.webContents.send('update_available');
    });

    autoUpdater.on('update-downloaded', () => {
      this.window.webContents.send('update_downloaded');
    });
  }
} 