import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/AdvancedFilters.css';

const CATEGORIES = ['T-shirt', 'Chemise', 'Pull', 'Col Roulé', 'Pantalon', 'Jeans', 'Short', 'Chaussures', 'Accessoires'];
const STATUS = ['disponible', 'vendu', 'réservé'];

export default function AdvancedFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    categories: [],
    status: [],
    prixMin: '',
    prixMax: '',
    dateDebut: null,
    dateFin: null
  });

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="advanced-filters">
      <div className="filter-section">
        <h3>Catégories</h3>
        <div className="categories-list">
          {CATEGORIES.map(cat => (
            <label key={cat} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, cat]
                    : filters.categories.filter(c => c !== cat);
                  handleChange('categories', newCategories);
                }}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Status</h3>
        <div className="status-list">
          {STATUS.map(stat => (
            <label key={stat} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.status.includes(stat)}
                onChange={(e) => {
                  const newStatus = e.target.checked
                    ? [...filters.status, stat]
                    : filters.status.filter(s => s !== stat);
                  handleChange('status', newStatus);
                }}
              />
              {stat}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Prix</h3>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.prixMin}
            onChange={(e) => handleChange('prixMin', e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.prixMax}
            onChange={(e) => handleChange('prixMax', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <h3>Date</h3>
        <div className="date-range">
          <DatePicker
            selected={filters.dateDebut}
            onChange={(date) => handleChange('dateDebut', date)}
            placeholderText="Date début"
          />
          <DatePicker
            selected={filters.dateFin}
            onChange={(date) => handleChange('dateFin', date)}
            placeholderText="Date fin"
          />
        </div>
      </div>
    </div>
  );
} 