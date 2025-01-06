import React, { useEffect, useState } from 'react';
import { setupRealtimeUpdates } from '../services/vintedAuth';

function Dashboard() {
  const [vintedData, setVintedData] = useState(null);

  useEffect(() => {
    // Configurer les mises à jour en temps réel
    const unsubscribe = setupRealtimeUpdates((data) => {
      setVintedData(data);
    });

    return () => {
      clearInterval(unsubscribe);
    };
  }, []);

  if (!vintedData) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div>
      <h1>Dashboard Vinted</h1>
      
      {/* Statistiques générales */}
      <div>
        <h2>Statistiques</h2>
        <p>Articles en vente: {vintedData.stats.totalItems}</p>
        <p>Ventes totales: {vintedData.stats.totalSales}</p>
        <p>Chiffre d'affaires: {vintedData.stats.revenue}€</p>
        <p>Prix moyen: {vintedData.stats.averagePrice.toFixed(2)}€</p>
      </div>

      {/* Liste des articles */}
      <div>
        <h2>Articles en vente</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {vintedData.items.map(item => (
            <div key={item.id}>
              <img src={item.photos[0]?.url} alt={item.title} style={{ width: '100%' }} />
              <h3>{item.title}</h3>
              <p>{item.price}€</p>
              <p>Vues: {item.view_count}</p>
              <p>Favoris: {item.favourite_count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 