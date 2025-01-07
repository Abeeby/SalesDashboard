const fetch = require('node-fetch');
const { saveCookies, loadCookies } = require('./cookies');

// Configuration de base
const VINTED_API = 'https://www.vinted.fr/api/v2';
const USER_ID = process.env.VINTED_USER_ID || '117458538';

// Cookies initiaux de la session active
const INITIAL_COOKIES = {
  anon_id: "435b3e2d-cc91-4b90-8282-2a74ed245632",
  v_udt: "eTQ5V0RtbnBzWmQ4d1UrQ2RYbUkrdnI0dzJjTHRDcStnME04Y2c9PS0tTy85cFk4Q2FmVkd4WnM1Ui0tMndaaVFnL3F0Y1ZaVUVYeCs0WVkwUT09",
  v_sid: "7b79c82c-1736266933",
  datadome: "P__vBLBLDvj0NxLOJap~_ZsdaxUYMvn2kA2b_SOxvIhpx0nLWByu7gzfvLr~XqQI6b8VErU0ti0a02fPVBXcpjKJshceZRHRGPrn9r2Y7BO~YY4eeQj~E2EAdxgB1Ump",
  cf_clearance: "_hCM38ueCT.XIK8vlbS3O3zMoUb.w4j9QZLRFKWrhrQ-1736266575-1.2.1.1-sEOmLIXF_dYdwabX1.7qcNIRCY_b4zdVSko7ePY9uJvxGsYbv07jJ7qsvqsy03jj27mb_.ScGcn0p6vjG4gGev.xR5ugJJY6n9YH2miOU9bxJ8gCC0JZOP909UmcbZXE7vgM8SxFfWbqi9Hl2nQ6F1wp3Oo7P7qZdY96yR5xNz5EkKKsC1XIDs5XzCKbUsuze3Few.G73XP_fgKBeJWiEZmvPNDEMCyTDhd_7H04VCmY0eDFNvtu1zhghgwGTPbenlwCvk78s3E8nPke0nj0aBBHuZR.M_OPkhkWWczfnQKlo93j9l4yx.Lybbfxkc4NndIobJvgL7dBiuUVDb9l2pL_YY7pOrN9xWQth1h3W2w"
};

// Headers essentiels avec les valeurs du nouveau HAR
const VINTED_HEADERS = {
  'Host': 'www.vinted.fr',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'TE': 'trailers'
};

async function initializeCookies() {
  try {
    console.log('Initialisation des cookies...');
    const initialCookies = Object.entries(INITIAL_COOKIES).map(([name, value]) => ({
      name,
      value,
      domain: '.vinted.fr',
      path: '/',
      secure: true,
      sameSite: 'Lax'
    }));
    
    await saveCookies(initialCookies);
    console.log('Cookies initiaux sauvegardés avec succès');
    return initialCookies;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des cookies:', error);
    throw error;
  }
}

async function getVintedData() {
  try {
    console.log('Chargement des cookies...');
    let cookies = await loadCookies();
    if (!cookies) {
      console.log('Pas de cookies trouvés, initialisation...');
      cookies = await initializeCookies();
    }

    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    console.log('En-tête Cookie:', cookieHeader.substring(0, 100) + '...');

    // D'abord, faire une requête à la page principale
    console.log('Requête à la page principale...');
    const mainResponse = await fetch('https://www.vinted.fr/member/' + USER_ID, {
      headers: {
        ...VINTED_HEADERS,
        'Cookie': cookieHeader
      }
    });

    if (!mainResponse.ok) {
      throw new Error(`Erreur page principale: ${mainResponse.status}`);
    }

    // Ensuite, faire la requête API
    console.log('Requête à l\'API...');
    const apiResponse = await fetch(`${VINTED_API}/users/${USER_ID}/items`, {
      headers: {
        ...VINTED_HEADERS,
        'Accept': 'application/json',
        'Cookie': cookieHeader
      }
    });

    if (!apiResponse.ok) {
      const text = await apiResponse.text();
      console.error('Réponse API:', text);
      throw new Error(`Erreur API: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    console.log('Données reçues avec succès');
    return data;

  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw error;
  }
}

module.exports = { getVintedData, initializeCookies }; 