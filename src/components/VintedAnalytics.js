import React from 'react';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function VintedAnalytics({ data }) {
  const salesByMonth = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [{
      label: 'Ventes mensuelles',
      data: data.salesByMonth,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const priceDistribution = {
    labels: ['0-10€', '10-20€', '20-50€', '50€+'],
    datasets: [{
      data: data.priceDistribution,
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)'
      ]
    }]
  };

  const performanceMetrics = {
    labels: data.performanceLabels,
    datasets: [{
      label: 'Métriques de performance',
      data: data.performanceData,
      backgroundColor: 'rgba(54, 162, 235, 0.5)'
    }]
  };

  return (
    <div className="vinted-analytics">
      <div className="chart-container">
        <h3>Évolution des ventes</h3>
        <Line data={salesByMonth} />
      </div>

      <div className="chart-container">
        <h3>Distribution des prix</h3>
        <Doughnut data={priceDistribution} />
      </div>

      <div className="chart-container">
        <h3>Métriques de performance</h3>
        <Bar data={performanceMetrics} />
      </div>
    </div>
  );
} 