import { useState } from 'react';
import { addItem } from '../api/items';
import '../styles/AddArticleModal.css';

export default function AddArticleModal({ onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    marque: '',
    categories: '',
    description: '',
    status: 'disponible',
    vues: 0,
    favoris: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const itemData = {
        ...formData,
        prix: parseFloat(formData.prix),
        categories: formData.categories.split(',').map(c => c.trim()),
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString()
      };

      await addItem(itemData);
      onAdd && onAdd(itemData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setError('Erreur lors de l\'ajout de l\'article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter un Article</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Prix</label>
            <input
              type="number"
              step="0.01"
              value={formData.prix}
              onChange={(e) => setFormData({...formData, prix: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Marque</label>
            <input
              type="text"
              value={formData.marque}
              onChange={(e) => setFormData({...formData, marque: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Catégories (séparées par des virgules)</label>
            <input
              type="text"
              value={formData.categories}
              onChange={(e) => setFormData({...formData, categories: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 