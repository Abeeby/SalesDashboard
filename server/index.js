const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json());

// Route pour la connexion Vinted
app.post('/api/vinted/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Aller sur Vinted
    await page.goto('https://www.vinted.fr/auth/login');
    
    // Remplir le formulaire de connexion
    await page.type('#email', email);
    await page.type('#password', password);
    await page.click('button[type="submit"]');
    
    // Attendre la redirection
    await page.waitForNavigation();
    
    // Vérifier si connecté
    const cookies = await page.cookies();
    await browser.close();
    
    res.json({ success: true, cookies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer les articles
app.get('/api/vinted/items/:userId', async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Aller sur la page du profil
    await page.goto(`https://www.vinted.fr/member/${req.params.userId}/items`);
    
    // Extraire les données des articles
    const items = await page.evaluate(() => {
      const articles = document.querySelectorAll('.feed-grid__item');
      return Array.from(articles).map(article => ({
        title: article.querySelector('.item-title')?.textContent,
        price: article.querySelector('.item-price')?.textContent,
        views: article.querySelector('.item-views')?.textContent,
        likes: article.querySelector('.item-likes')?.textContent,
        status: article.querySelector('.item-status')?.textContent,
        image: article.querySelector('img')?.src
      }));
    });
    
    await browser.close();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 