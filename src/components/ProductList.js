import { useState, useEffect } from 'react';
import AddArticleModal from './AddArticleModal';
import EditArticleModal from './EditArticleModal';
import ConfirmDialog from './ConfirmDialog';
import { deleteItem, getItems } from '../api/items';
import '../styles/ProductList.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'gallery'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const loadProducts = async () => {
    try {
      const items = await getItems();
      setProducts(items);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (newProduct) => {
    await loadProducts(); // Recharge la liste après l'ajout
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marque.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || 
                           product.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const csv = [
      ['Nom', 'Prix', 'Status', 'Marque', 'Catégories', 'Description', 'Date de Vente'],
      ...filteredProducts.map(p => [
        p.nom,
        p.prix,
        p.status,
        p.marque,
        p.categories.join(', '),
        p.description,
        p.dateVente
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'articles.csv';
    a.click();
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setProducts(products.filter(p => p.id !== id));
      setDeleteId(null);
    } catch (error) {
      setError('Erreur lors de la suppression');
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingItem(product);
  };

  const handleEditComplete = (updatedItem) => {
    setProducts(products.map(p => 
      p.id === updatedItem.id ? { ...p, ...updatedItem } : p
    ));
    setEditingItem(null);
    setSuccessMessage('Article modifié avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="product-list">
      <div className="controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Tous">Toutes les catégories</option>
            {/* Ajoutez vos catégories ici */}
          </select>
        </div>
        
        <div className="actions">
          <button onClick={() => setViewMode(viewMode === 'list' ? 'gallery' : 'list')}>
            {viewMode === 'list' ? 'Vue Galerie' : 'Vue Liste'}
          </button>
          <button onClick={() => setShowModal(true)}>+ Ajouter un Article</button>
          <button onClick={handleExport}>Exporter</button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <table>
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
                  <span className={`status ${product.status}`}>
                    {product.status}
                  </span>
                </td>
                <td>{product.vues}</td>
                <td>{product.favoris}</td>
                <td>{product.dateVente}</td>
                <td>
                  <button className="edit" onClick={() => handleEdit(product)}>✏️</button>
                  <button className="delete" onClick={() => setDeleteId(product.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="gallery-view">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-info">
                <h3>{product.nom}</h3>
                <p className="price">{product.prix}€</p>
                <p className="status">{product.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <AddArticleModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          message="Êtes-vous sûr de vouloir supprimer cet article ?"
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editingItem && (
        <EditArticleModal
          article={editingItem}
          onClose={() => setEditingItem(null)}
          onEdit={handleEditComplete}
        />
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
} 