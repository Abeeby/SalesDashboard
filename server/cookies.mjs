import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const COOKIES_FILE = path.join(__dirname, 'cookies.json');

async function saveCookies(cookies) {
  await fs.writeFile(COOKIES_FILE, JSON.stringify(cookies, null, 2));
}

async function loadCookies() {
  try {
    const data = await fs.readFile(COOKIES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export { saveCookies, loadCookies }; 