import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function saveCookies() {
  const sessionInfo = {
    cookies: {
      "_vinted_fr_session": "M0Jad0dJenNXMVZreDUrS1BiZlVaSk9LZGlDZmRadms3dWN3cXhCbmRYRHprOTFKZEMwQks0WXVvZTM4UFpPYndySzRJLzhSSnoyS0VTYVpySm12b1B6RWw1RDczbW5ZMmxxQ2FjdkhxWTA3YjN4REdZOHdBTXZwZHNUQ3p0a0JxTUFjbThNTzNaeS8yaUsrQm9HS2tuRTNEWnRrOXZZZDNzNGx3VVlyMW9NMW5KZTdTOVRxc1hKTG5LN2c0dzBBZDlWVFVpR1Vrdk1YYkY2bGlkUFZNdHVpSjRBWk5BTkowM1dWYjg3aVVCZXN3NTJSa1pwS251SzZUUnBjSGNvWnc5cElpR3RmTjlpRDBVeUZwbnQ5aHZseElyL2hnM0xkR0ZVN2ZuSGpib3ZtRUd6ekF6eXlNa1RzTnMzczVqRk9BZ3AzSDZIWExNakFrSXZUbFRheEtYTmw5VEh2bGo3RXN6UUIzcVRPOUNLVmhFZVF1cTJtR21vSmxscDc3ZTFhZzFUQTE1cEplOXBqZFZKVXFFNlNaNXQrRW1JcWpmNW5jTGJhb3pmdEJUWi95Rmw3V2FhaXdWNDczeFhpWmt5Z0RpWmpKSHlhZWMyNzd4Wm9SMk9KVmoxazlvZFMyd2pBWWlxVUNoclRiQWxyMlNETkl2anh3YWJqZE5tSFNaYUZXelVKeTBBbktzMFQxTkQyWjlHbDJNemNieVI2Y05taE85b05XQWw3cjlyc0xFU2p5bmhuVS93WjV2dkxTZG9KYk81a0QxMG55R1c4aTJaUWxTMS82bnljdjNQOWdoQlArT2RzbGcxQlE4Ylh0VXNmUnFhTmxDQWMxclc0UzR2alNUL3U1eEdybTJlRFpPcjR1VU5RcVpldzJQL1cwRWNranhZV1h3dWFpWWJZaDczaHY1UTJZT2s4eWJOdEw4aVMzZGpoblJ0WWlXOG40SDBWVWlMdHI3UzJDeVdCVWlnV0E2TkNSdTJoY3lOc2lsbExKUFFFbEJTdWp6TnR1dzVQWDZpWVVqeDZZS0d5RVBMTlRyTUtjVXM3WlRNMk9zSHVqU3MrNzExeEVyUERYTnNEbElyb1JLV045Wmd5NHZwREVVbVh4RTBROGtMaGtGcXJxNE9vSFJ2K2tkenJYSzNzVm9FWGFnQ2RyMmNJUGZnVlR0S",
      "v_uid": "117458538",
      "datadome": "ioVHdmz_q_oJE3HHeTmhSsmPrv11C7pM8ODmzHNaJzGmGpzsIQcrYHcScTC7duIa2CK~gpDKngLJJMxdaPVDkSInaL1tf0ttwvSxWMOzQ",
      "cf_clearance": "CQj7nZgQi7nZgAcABBENBUFsAP_gAAAAACh0JnNX_G_bXJBK71sHkxt1P9_h7HzQefbfJk~4FybW_JwX32EeNA36pqYkmRiAuzTBQbNIG",
      "anon_id": "435b3e2d-cc91-4b90-8282-2a74ed245632"
    },
    timestamp: new Date().toISOString(),
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    browser: "firefox"
  };

  // Sauvegarder la configuration
  await fs.writeFile(
    path.join(__dirname, '..', 'session.json'),
    JSON.stringify(sessionInfo, null, 2)
  );

  console.log('💾 Session sauvegardée avec succès !');
  console.log('✨ Configuration terminée !');
  
  return sessionInfo;
}

// Exécuter le script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  saveCookies().catch(console.error);
}

export { saveCookies }; 