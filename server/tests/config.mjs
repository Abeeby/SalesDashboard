export default {
  vinted: {
    baseUrl: 'https://www.vinted.fr',
    userId: '117458538',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
      'Accept': 'application/json',
      'Accept-Language': 'fr,fr-FR;q=0.9,en-US;q=0.8,en;q=0.7',
      'Origin': 'https://www.vinted.fr',
      'Referer': 'https://www.vinted.fr/'
    },
    cookies: {
      // Ajoutez vos cookies ici
    }
  },
  api: {
    baseUrl: 'http://localhost:3001',
    endpoints: {
      data: '/api/vinted/data',
      items: '/api/vinted/items',
      messages: '/api/vinted/messages'
    }
  },
  tests: {
    timeout: 5000,
    retries: 3
  }
}; 