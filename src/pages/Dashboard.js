import React, { useEffect, useState } from 'react';
import { setupRealtimeUpdates } from '../services/vintedAuth';
import CircularProgress from '@mui/material/CircularProgress';

function Dashboard() {
  const [vintedData, setVintedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initializeData() {
      try {
        // Configuration des mises à jour en temps réel
        const unsubscribe = await setupRealtimeUpdates((data) => {
          console.log('Nouvelles données reçues:', data);
          setVintedData(data);
          setLoading(false);
        });

        return () => {
          if (unsubscribe) unsubscribe();
        };
      } catch (err) {
        console.error('Erreur d\'initialisation:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    initializeData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <p style={{ marginLeft: '1rem' }}>Chargement des données Vinted...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h2>Erreur de chargement</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!vintedData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Aucune donnée disponible</h2>
        <p>Veuillez vous connecter à Vinted</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard Vinted</h1>
      
      {/* Statistiques générales */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>Statistiques</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <h3>Articles en vente</h3>
            <p>{vintedData.stats.totalItems}</p>
          </div>
          <div>
            <h3>Ventes totales</h3>
            <p>{vintedData.stats.totalSales}</p>
          </div>
          <div>
            <h3>Chiffre d'affaires</h3>
            <p>{vintedData.stats.revenue}€</p>
          </div>
          <div>
            <h3>Prix moyen</h3>
            <p>{vintedData.stats.averagePrice.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div>
        <h2>Articles en vente</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          {vintedData.items?.map(item => (
            <div key={item.id} style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'white'
            }}>
              <img 
                src={item.photos[0]?.url} 
                alt={item.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <h3 style={{ marginTop: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50' }}>{item.price}€</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                <p>👁️ {item.view_count}</p>
                <p>❤️ {item.favourite_count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 