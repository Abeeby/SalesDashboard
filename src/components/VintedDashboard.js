import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VintedDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/vinted/data');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
        // Rediriger vers la page de connexion si nécessaire
        if (err.message.includes('401')) {
          navigate('/login');
        }
      }
    }

    fetchData();
  }, [navigate]);

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!data) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Dashboard Vinted</h1>
      {/* Afficher les données ici */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default VintedDashboard; 