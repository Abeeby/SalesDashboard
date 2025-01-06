import { useMemo } from 'react';
import '../styles/DashboardStats.css';

export default function DashboardStats({ products }) {
  const stats = useMemo(() => {
    return {
      totalVentes: products.filter(p => p.status === 'vendu').length,
      revenuTotal: products.reduce((sum, p) => p.status === 'vendu' ? sum + p.prix : sum, 0),
      articlesDisponibles: products.filter(p => p.status === 'disponible').length,
      moyenneVues: Math.round(products.reduce((sum, p) => sum + p.vues, 0) / products.length || 0)
    };
  }, [products]);

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Ventes Totales</h3>
        <p className="stat-value">{stats.totalVentes}</p>
      </div>
      <div className="stat-card">
        <h3>Revenus Total</h3>
        <p className="stat-value">{stats.revenuTotal}€</p>
      </div>
      <div className="stat-card">
        <h3>Articles Disponibles</h3>
        <p className="stat-value">{stats.articlesDisponibles}</p>
      </div>
      <div className="stat-card">
        <h3>Moyenne des Vues</h3>
        <p className="stat-value">{stats.moyenneVues}</p>
      </div>
    </div>
  );
} 