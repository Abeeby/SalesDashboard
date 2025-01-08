import React from 'react';

export function VintedFilters({ onFilterChange }) {
  return (
    <div className="vinted-filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="Rechercher un article..."
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <select onChange={(e) => onFilterChange('status', e.target.value)}>
          <option value="">Tous les statuts</option>
          <option value="à_vendre">À vendre</option>
          <option value="vendu">Vendu</option>
          <option value="réservé">Réservé</option>
        </select>

        <select onChange={(e) => onFilterChange('price', e.target.value)}>
          <option value="">Tous les prix</option>
          <option value="0-10">0-10€</option>
          <option value="10-20">10-20€</option>
          <option value="20-50">20-50€</option>
          <option value="50+">50€ et plus</option>
        </select>

        <select onChange={(e) => onFilterChange('date', e.target.value)}>
          <option value="">Toutes les dates</option>
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>
    </div>
  );
} 