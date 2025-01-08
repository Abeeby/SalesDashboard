import React from 'react';

export function ItemSorting({ onSort }) {
  return (
    <div className="item-sorting">
      <select onChange={(e) => onSort(e.target.value)}>
        <option value="">Trier par...</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="date-new">Plus récents</option>
        <option value="date-old">Plus anciens</option>
        <option value="popularity">Popularité</option>
      </select>
    </div>
  );
} 