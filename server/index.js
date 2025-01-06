const express = require('express');
const cors = require('cors');
const app = express();
const { scrapeZandishop } = require('./scraper');

app.use(cors());

app.get('/api/zandishop', async (req, res) => {
  try {
    const data = await scrapeZandishop();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 