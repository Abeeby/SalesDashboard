import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

function VintedDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/vinted/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Rafraîchir toutes les 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!data) return <div>Pas de données disponibles</div>;

  return (
    <div className="dashboard">
      {/* Statistiques générales */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Articles en vente</h3>
          <p>{data.profile.totalItems}</p>
        </div>
        <div className="stat-card">
          <h3>Ventes totales</h3>
          <p>{data.stats.totalSales}</p>
        </div>
        <div className="stat-card">
          <h3>Revenu total</h3>
          <p>{data.stats.totalRevenue}€</p>
        </div>
        <div className="stat-card">
          <h3>Prix moyen</h3>
          <p>{data.stats.averagePrice}€</p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-grid">
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
      </div>
    </div>
  );
}

export default VintedDashboard; 