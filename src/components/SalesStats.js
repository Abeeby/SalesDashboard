import React from 'react';
import { Line } from 'react-chartjs-2';

export function SalesStats({ salesData }) {
  // Préparer les données pour le graphique
  const chartData = {
    labels: salesData.map(sale => sale.saleDate),
    datasets: [{
      label: 'Ventes',
      data: salesData.map(sale => parseFloat(sale.price.replace('€', ''))),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="sales-stats">
      <h3>Statistiques des ventes</h3>
      <div className="stats-summary">
        <div className="stat-box">
          <h4>Total des ventes</h4>
          <p>{salesData.length}</p>
        </div>
        <div className="stat-box">
          <h4>Chiffre d'affaires</h4>
          <p>{salesData.reduce((sum, sale) => 
            sum + parseFloat(sale.price.replace('€', '')), 0
          ).toFixed(2)}€</p>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} />
      </div>
    </div>
  );
} 