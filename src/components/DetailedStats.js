import React from 'react';

export function DetailedStats({ data }) {
  const calculateStats = () => {
    const sales = data.sales || [];
    const items = data.items || [];
    
    return {
      totalRevenue: sales.reduce((sum, sale) => sum + parseFloat(sale.price.replace('€', '')), 0),
      averagePrice: sales.length ? (sales.reduce((sum, sale) => sum + parseFloat(sale.price.replace('€', '')), 0) / sales.length) : 0,
      bestSellingCategory: calculateBestCategory(sales),
      stockValue: items.reduce((sum, item) => sum + parseFloat(item.price.replace('€', '')), 0),
      conversionRate: (sales.length / (sales.length + items.length)) * 100,
      averageTimeToSell: calculateAverageTimeToSell(sales),
      topBuyers: calculateTopBuyers(sales)
    };
  };

  const stats = calculateStats();

  return (
    <div className="detailed-stats">
      <h3>Statistiques détaillées</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Chiffre d'affaires total</h4>
          <p>{stats.totalRevenue.toFixed(2)}€</p>
        </div>
        <div className="stat-card">
          <h4>Prix moyen de vente</h4>
          <p>{stats.averagePrice.toFixed(2)}€</p>
        </div>
        <div className="stat-card">
          <h4>Meilleure catégorie</h4>
          <p>{stats.bestSellingCategory}</p>
        </div>
        <div className="stat-card">
          <h4>Valeur du stock</h4>
          <p>{stats.stockValue.toFixed(2)}€</p>
        </div>
        <div className="stat-card">
          <h4>Taux de conversion</h4>
          <p>{stats.conversionRate.toFixed(1)}%</p>
        </div>
        <div className="stat-card">
          <h4>Temps moyen de vente</h4>
          <p>{stats.averageTimeToSell} jours</p>
        </div>
      </div>

      <div className="top-buyers">
        <h4>Meilleurs acheteurs</h4>
        <ul>
          {stats.topBuyers.map((buyer, index) => (
            <li key={index}>
              {buyer.name} - {buyer.purchases} achats
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 