import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SESSION_FILE = path.join(__dirname, 'session.json');

// Structure de session complète
const DEFAULT_SESSION = {
  anon_id: "435b3e2d-cc91-4b90-8282-2a74ed245632",
  _vinted_fr_session: "votre_session_id",
  v_uid: "117458538",
  datadome: "votre_datadome",
  cf_clearance: "votre_cf_clearance"
};

async function saveSession(session) {
  await fs.writeFile(SESSION_FILE, JSON.stringify(session, null, 2));
}

async function loadSession() {
  try {
    const data = await fs.readFile(SESSION_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_SESSION;
  }
}

export { saveSession, loadSession }; 