import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function VintedDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Détecter si nous sommes en production ou développement
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://votre-domaine.com/api/vinted/data'
    : 'http://localhost:3001/api/vinted/data';

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from:', API_URL);
        const response = await fetch(API_URL, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data received:', result);
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Erreur de chargement: {error}
        </Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Alert severity="info">
          Pas de données disponibles
        </Alert>
      </Box>
    );
  }

  return (
    <div className="dashboard">
      {/* Statistiques générales */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Articles en vente</h3>
          <p>{data.profile?.totalItems || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Ventes totales</h3>
          <p>{data.stats?.totalSales || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Revenu total</h3>
          <p>{data.stats?.totalRevenue || 0}€</p>
        </div>
        <div className="stat-card">
          <h3>Prix moyen</h3>
          <p>{data.stats?.averagePrice || 0}€</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
        {data.stats?.salesByMonth && (
          <div className="chart">
            <h3>Ventes par mois</h3>
            <LineChart width={600} height={300} data={data.stats.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </div>
        )}

        {data.items && (
          <div className="chart">
            <h3>Articles par statut</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={data.items.reduce((acc, item) => {
                  const status = acc.find(s => s.name === item.status);
                  if (status) status.value++;
                  else acc.push({ name: item.status, value: 1 });
                  return acc;
                }, [])}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
}

export default VintedDashboard; 