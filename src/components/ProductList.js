import { useState } from 'react';
import { categories } from '../config/categories';
import '../styles/ProductList.css';

export default function ProductList({ products, setProducts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'Tous' || product.status === selectedStatus.toLowerCase();
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.some(cat => product.categories.includes(cat));
    return matchesSearch && matchesStatus && matchesCategories;
  });

  return (
    <div className="product-list">
      <div className="list-header">
        <h2>Liste des Articles</h2>
        <div className="list-actions">
          <button className="action-btn view-gallery">
            VUE GALERIE
          </button>
          <button className="action-btn export">
            EXPORTER
          </button>
          <button className="action-btn add">
            + AJOUTER UN ARTICLE
          </button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="status-select"
        >
          <option>Tous</option>
          <option>Disponible</option>
          <option>Vendu</option>
          <option>En attente</option>
        </select>
      </div>

      <div className="categories-filter">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategories.includes(category.label) ? 'active' : ''}`}
            onClick={() => handleCategoryToggle(category.label)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prix</th>
            <th>Status</th>
            <th>Vues</th>
            <th>Favoris</th>
            <th>Date de Vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.nom}</td>
              <td>{product.prix}€</td>
              <td>
                <span className={`status-badge ${product.status}`}>
                  {product.status}
                </span>
              </td>
              <td>{product.vues}</td>
              <td>{product.favoris}</td>
              <td>{product.dateVente || '-'}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => {}}>
                  ✏️
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 