import { useState } from 'react';
import { addItem } from '../api/items';
import '../styles/AddArticleModal.css';
import ImageUpload from './ImageUpload';

export default function AddArticleModal({ onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    marque: '',
    categories: '',
    description: '',
    status: 'disponible'
  });
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation basique
      if (!formData.nom.trim()) {
        throw new Error('Le nom est requis');
      }

      if (!formData.prix || parseFloat(formData.prix) <= 0) {
        throw new Error('Le prix doit être supérieur à 0');
      }

      const itemData = {
        ...formData,
        prix: parseFloat(formData.prix),
        categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
        imageUrl
      };

      const newItem = await addItem(itemData);
      onAdd && onAdd(newItem);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setError(error.message || 'Erreur lors de l\'ajout de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Prix</label>
            <input
              type="number"
              name="prix"
              step="0.01"
              value={formData.prix}
              onChange={handleChange}
              required
              min="0.01"
            />
          </div>

          <div className="form-group">
            <label>Marque</label>
            <input
              type="text"
              name="marque"
              value={formData.marque}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Catégories (séparées par des virgules)</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <ImageUpload
              itemId="temp" // sera remplacé par l'ID réel après création
              onImageUploaded={(url) => setImageUrl(url)}
            />
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Aperçu" 
                className="image-preview"
              />
            )}
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