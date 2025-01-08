const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.post('/inventory', async (req, res) => {
  try {
    const { inventory } = req.body;
    
    // Sauvegarder dans Firebase
    await db.collection('inventory').doc('latest').set({
      items: inventory,
      updatedAt: new Date().toISOString()
    });

    // Sauvegarder l'historique
    await db.collection('inventoryHistory').add({
      items: inventory,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true, message: 'Inventaire importé avec succès' });
  } catch (error) {
    console.error('Erreur d\'importation:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 