import { useState } from 'react';
import { addItem } from '../api/items';
import '../styles/AddArticleModal.css';

export default function AddArticleModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    marque: '',
    categories: '',
    description: '',
    status: 'disponible',
    plateforme: 'vinted'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addItem({
        ...formData,
        prix: parseFloat(formData.prix),
        categories: formData.categories.split(',').map(c => c.trim()),
        dateImport: new Date().toISOString()
      });
      onAdd();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter un Article</h2>
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

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="disponible">Disponible</option>
              <option value="vendu">Vendu</option>
              <option value="réservé">Réservé</option>
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">Ajouter</button>
            <button type="button" onClick={onClose} className="cancel-btn">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
} 