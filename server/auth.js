const fetch = require('node-fetch');
const { saveCookies, loadCookies } = require('./cookies');

// Configuration de base
const VINTED_API = 'https://www.vinted.fr/api/v2';
const USER_ID = process.env.VINTED_USER_ID || '117458538';

// Cookies initiaux de votre session active
const INITIAL_COOKIES = {
  anon_id: "435b3e2d-cc91-4b90-8282-2a74ed245632",
  _vinted_fr_session: "M0Jad0dJenNXMVZreDUrS1BiZlVaSk9LZGlDZmRadms3dWN3cXhCbmRYRHprOTFKZEMwQks0WXVvZTM4UFpPYndySzRJLzhSSnoyS0VTYVpySm12b1B6RWw1RDczbW5ZMmxxQ2FjdkhxWTA3YjN4REdZOHdBTXZwZHNUQ3p0a0JxTUFjbThNTzNaeS8yaUsrQm9HS2tuRTNEWnRrOXZZZDNzNGx3VVlyMW9NMW5KZTdTOVRxc1hKTG5LN2c0dzBBZDlWVFVpR1Vrdk1YYkY2bGlkUFZNdHVpSjRBWk5BTkowM1dWYjg3aVVCZXN3NTJSa1pwS251SzZUUnBjSGNvWnc5cElpR3RmTjlpRDBVeUZwbnQ5aHZseElyL2hnM0xkR0ZVN2ZuSGpib3ZtRUd6ekF6eXlNa1RzTnMzczVqRk9BZ3AzSDZIWExNakFrSXZUbFRheEtYTmw5VEh2bGo3RXN6UUIzcVRPOUNLVmhFZVF1cTJtR21vSmxscDc3ZTFhZzFUQTE1cEplOXBqZFZKVXFFNlNaNXQrRW1JcWpmNW5jTGJhb3pmdEJUWi95Rmw3V2FhaXdWNDczeFhpWmt5Z0RpWmpKSHlhZWMyNzd4Wm9SMk9KVmoxazlvZFMyd2pBWWlxVUNoclRiQWxyMlNETkl2anh3YWJqZE5tSFNaYUZXelVKeTBBbktzMFQxTkQyWjlHbDJNemNieVI2Y05taE85b05XQWw3cjlyc0xFU2p5bmhuVS93WjV2dkxTZG9KYk81a0QxMG55R1c4aTJaUWxTMS82bnljdjNQOWdoQlArT2RzbGcxQlE4Ylh0VXNmUnFhTmxDQWMxclc0UzR2alNUL3U1eEdybTJlRFpPcjR1VU5RcVpldzJQL1cwRWNranhZV1h3dWFpWWJZaDczaHY1UTJZT2s4eWJOdEw4aVMzZGpoblJ0WWlXOG40SDBWVWlMdHI3UzJDeVdCVWlnV0E2TkNSdTJoY3lOc2lsbExKUFFFbEJTdWp6TnR1dzVQWDZpWVVqeDZZS0d5RVBMTlRyTUtjVXM3WlRNMk9zSHVqU3MrNzExeEVyUERYTnNEbElyb1JLV045Wmd5NHZwREVVbVh4RTBROGtMaGtGcXJxNE9vSFJ2K2tkenJYSzNzVm9FWGFnQ2RyMmNJUGZnVlR0SE13OGdGSWwwSjVkems1R3hTTmxMdkdQNkwwWU4xcFZORFNCRTFYL29UaXB6Mnk3K0lFUU5HL1dMdzVXY1Z4Q1ArMzJUYVBjK2xDeXBMcXUxUFk5b3VkSTgzQzBtSlpDVkRQdmM2aXVOZG1IaVF5ZlNubEt2WndXa0FTYlh6Q096VzROS0hlMDF2b0wrZ0VRSUhMT0F4ek9PSGF6bHZaS3NtV2MyUGt0NGdyMzZnUHh0TXllRlh1L0hIcjVMNU90L1ZyVEs0V0YxTVdlMngwU0RpQXVUVFNqclRvQmdUU2hGZXB2REtrbnkzaFpjbDUxRkJUYi9YWlNJT3Z3RXlCaHpCRmtoOEt4V3IwN1dQNitveW9qTzUrWW5EcEc0eks3amI3Ky9raVFVVWp2QXA5dGJRSmJNVjRsMVBBL3hSaTFZNDgwd0RjUXFBQi9CbC9vcWl3TU1nMDd0TkJNdnJhYlFyWTUxaXNuQXFScHlRZDVPTkhpcldodUExZEFKRmpSR3dBU29WQ0tOZjFYOCtHV2N3WFlGbE8xUEJNM0MyRUd0a2kzYmc2UXh2Ry9RVHl6bkIzSWlhaXdML3hsUUhQdzR3MWMyaGdiYkdEOTBrWTdnRVFJWWwydFhuL1JaN0szcXF4NGd6eGF4ZGM4L2tzazBVRno5WU1oNnNzSmdrcUdvd3pjRE05cUtIbXVYS2IwTEFjY0VRVnc3R20wZUcySUc2YTd0NDUyOCtzNEJoRnNqcDQyYTB3aEtXY29yeDdVUHFZN1Q5ZmhkNUdxbjRFakdDVWpUNVJSL2VuQ2c0YmZteExOQTFBZHF2RjVOY1FJaG4yUnV2cWtBRXk3emVWelpiMWMxdFlWMk5kejlrcW02UkVOcVhWUncxemt6dkpITHVUckJZMjk2T3NPNzJ3UDA3WHY3YTZUYm00VHQ2aTk2M2dha2hidFNRSCtpcGdJcXlNK09KWTFtMEdQdzNIeGtMSmhTb3FVcnF4eFMrR3NuRndtcmlXdGtnSHpTL0V4T3hEKzhhNnA2TFZrWkQ2MnloY3lQVXNoRytsRUM3QW5UWlFWYlFqSFlNRStmTmRQSDRESC82WFdzUWlnVTRXeVRrRXM2a0FBb0cvVGZuQ2MvcDhjYjFTelVBeVVCenhMVkNxZmRNNUJ6Uk9BUXF6VGVXMkpSRFBGY01ETWhkVmRDYVU3bXAxKy84elplaHNRbnU3OWRVK0N6Zkp3M2RZcGdwM3BsQ2I5bkNqV1B5TXliVzc4cVpFYnFycjZRbUQ2c3A0NlhERjdkZVEzL1ljN1luUnErWUZVZzFwVnRWVFRRKzVDWS9hZ1JxbnZEODFkK1E1U3BiN253eHVnRE5SbVlld0FGWUlRSlZRckZRMXZNaGhLenU3d2svc1k1RW9mT0lNR2EyaHlkUHBpZ2ltQ3lnYjZickJvOEI4QlhJVmN0UUNPQ0VIZExzRDRka0UzRHlBblFvd2kyWVp6V000RHVsZTg1Uis0cTM4dlVGQjRLZ1hEZDhwZHBCdUtSQno0NDUrSi85b2lvSGs3QWxWRnloNm5zSzNtVzFLRUJSSFNxWmNPUVJDTlRjUkYzU3ZJRm1QY1F6bEFvWGJBNzRqVGhHNVlUU3BUVXQwbldRLS1WeG0xdXVDTlNRbE5oWnFsRTZQbFFnPT0%3D--78fb0d9b49001e14e0c17347ccbb7c0dc091102c",
  cf_clearance: "YeLHlO2s7qZ1eaEFdXlpwIyCsudjHZvEixqssX8AbUQ-1736177077-1.2.1.1-5H_.CqxTKph47esU.vkKo6A.B_wWF0T9oebb3XTS8tPrAGe_5vcMPBtm5cT7ld.406GEIFd1vmJ.7w2T_huGje2_wKe3xtvEQ50whf4F6Wz7zkCO7hHU_L1L0s_Y4s4_sG0oRgaDJMEjGhewkfKhMoGfmucOHp68OW9tK4GKMgrf7ddCQRA0JqxoymCQ4DhsHbIMceI5W9wzl.yjjkej359B6jdCYxpe9jY0zvlI.AFoyUFEDbl4jkEBxkqeUZ.ptnYTdMziUGnfY1.u31Q6wacA.W.6Z8NVX39laXPNXuomNqxGH9UXpR6qW_JqfxqlXULc1.SsiE9ynB1dqiwpllacYeF.syiYfQbbPZdS5wk",
  datadome: "531dI43IufIFYfMQ3EAE6ZZf2My1RiIMaJjMUHO7TW629eIVpJs4oKvwkCCmRNd9rFbPCqhwUUBjESLqePsIXswnFnBDCfoR8neYNy1YYkiyn4N3Pxu6EotDIXY5Ysl3"
};

// Headers essentiels
const VINTED_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Accept': 'application/json',
  'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
  'Content-Type': 'application/json',
  'X-App-Version': '2024.2.0',
  'Origin': 'https://www.vinted.fr',
  'Referer': 'https://www.vinted.fr/',
  'X-Requested-With': 'XMLHttpRequest',
  'Connection': 'keep-alive'
};

// Initialiser les cookies au démarrage
async function initializeCookies() {
  const initialCookies = Object.entries(INITIAL_COOKIES).map(([name, value]) => ({
    name,
    value,
    domain: '.vinted.fr',
    path: '/',
    secure: true,
    sameSite: 'none'
  }));
  
  await saveCookies(initialCookies);
  console.log('Cookies initiaux sauvegardés');
  return initialCookies;
}

async function getVintedData() {
  try {
    let cookies = await loadCookies();
    if (!cookies) {
      cookies = await initializeCookies();
    }

    const response = await fetch(`${VINTED_API}/users/${USER_ID}/items`, {
      headers: {
        ...VINTED_HEADERS,
        'Cookie': cookies.map(c => `${c.name}=${c.value}`).join('; ')
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur de récupération des données:', error);
    throw error;
  }
}

module.exports = { getVintedData, initializeCookies }; 