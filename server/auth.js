const puppeteer = require('puppeteer');
const { saveCookies, loadCookies } = require('./cookies');

const VINTED_COOKIES = {
  anon_id: "435b3e2d-cc91-4b90-8282-2a74ed245632",
  v_uid: "117458538",
  access_token_web: "eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImNsaWVudF9pZCI6IndlYiIsImF1ZCI6ImZyLmNvcmUuYXBpIiwic3ViIjoxMTc0NTg1MzgsImlhdCI6MTczNjE3NzIyMiwic2lkIjoiZmRkMDdkNjctMTczNjE3NzIyMiIsInNjb3BlIjoidXNlciIsImV4cCI6MTczNjE4NDQyMiwicHVycG9zZSI6ImFjY2VzcyIsImxvZ2luX3R5cGUiOjMsImFjdCI6eyJzdWIiOjExNzQ1ODUzOH0sImFjY291bnRfaWQiOjgyMTY4Mjk4fQ",
  cf_clearance: "YeLHlO2s7qZ1eaEFdXlpwIyCsudjHZvEixqssX8AbUQ-1736177077-1.2.1.1-5H_.CqxTKph47esU.vkKo6A.B_wWF0T9oebb3XTS8tPrAGe_5vcMPBtm5cT7ld.406GEIFd1vmJ.7w2T_huGje2_wKe3xtvEQ50whf4F6Wz7zkCO7hHU_L1L0s_Y4s4_sG0oRgaDJMEjGhewkfKhMoGfmucOHp68OW9tK4GKMgrf7ddCQRA0JqxoymCQ4DhsHbIMceI5W9wzl.yjjkej359B6jdCYxpe9jY0zvlI.AFoyUFEDbl4jkEBxkqeUZ.ptnYTdMziUGnfY1.u31Q6wacA.W.6Z8NVX39laXPNXuomNqxGH9UXpR6qW_JqfxqlXULc1.SsiE9ynB1dqiwpllacYeF.syiYfQbbPZdS5wk",
  datadome: "531dI43IufIFYfMQ3EAE6ZZf2My1RiIMaJjMUHO7TW629eIVpJs4oKvwkCCmRNd9rFbPCqhwUUBjESLqePsIXswnFnBDCfoR8neYNy1YYkiyn4N3Pxu6EotDIXY5Ysl3"
};

const VINTED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1'
};

async function authenticateVinted() {
  try {
    // Convertir les cookies du format HAR en format attendu
    const cookies = Object.entries(VINTED_COOKIES).map(([name, value]) => ({
      name,
      value,
      domain: '.vinted.fr',
      path: '/'
    }));

    // Sauvegarder les cookies
    await saveCookies(cookies);
    
    return { success: true, cookies, headers: VINTED_HEADERS };
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { authenticateVinted, VINTED_HEADERS }; 