const admin = require('firebase-admin');
const serviceAccount = require('../firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function saveToFirebase(data) {
  try {
    // Sauvegarder les données actuelles
    await db.collection('vintedData').doc('latest').set(data);

    // Sauvegarder dans l'historique
    await db.collection('vintedHistory').add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    // Mettre à jour les statistiques agrégées
    await updateAggregatedStats(data);

    console.log('Données sauvegardées dans Firebase');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans Firebase:', error);
    throw error;
  }
}

async function updateAggregatedStats(data) {
  const statsRef = db.collection('statistics').doc('aggregated');
  
  await db.runTransaction(async (transaction) => {
    const statsDoc = await transaction.get(statsRef);
    const currentStats = statsDoc.exists ? statsDoc.data() : {
      totalRevenue: 0,
      totalSales: 0,
      averagePrices: []
    };

    const newStats = {
      totalRevenue: currentStats.totalRevenue + data.stats.totalRevenue,
      totalSales: currentStats.totalSales + data.stats.totalSales,
      averagePrices: [
        ...currentStats.averagePrices,
        {
          date: new Date().toISOString(),
          price: data.stats.averagePrice
        }
      ].slice(-30) // Garder seulement les 30 derniers jours
    };

    transaction.set(statsRef, newStats);
  });
}

module.exports = { saveToFirebase }; 