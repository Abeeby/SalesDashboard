import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie
} from 'recharts';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

function VintedDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/vinted/data');
        if (!response.ok) throw new Error('Erreur serveur');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Alert severity="info">Pas de données</Alert>;

  return (
    <Box p={3}>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Articles en vente</h3>
          <p>{data.stats.totalItems}</p>
        </div>
        <div className="stat-card">
          <h3>Vues totales</h3>
          <p>{data.stats.totalViews}</p>
        </div>
        <div className="stat-card">
          <h3>Likes totaux</h3>
          <p>{data.stats.totalLikes}</p>
        </div>
        <div className="stat-card">
          <h3>Prix moyen</h3>
          <p>{data.stats.averagePrice.toFixed(2)}€</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart">
          <h3>Articles par statut</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={Object.entries(
                data.items.reduce((acc, item) => {
                  acc[item.status] = (acc[item.status] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({ name, value }))}
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
      </div>
    </Box>
  );
}

export default VintedDashboard; 