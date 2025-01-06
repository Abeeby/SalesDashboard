import { useState, useEffect } from 'react';
import { updateItem } from '../api/items';
import { validateItem } from '../utils/validation';
import '../styles/AddArticleModal.css';

export default function EditArticleModal({ article, onClose, onEdit }) {
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    marque: '',
    categories: '',
    description: '',
    status: 'disponible',
    plateforme: 'vinted'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        categories: article.categories.join(', '),
        prix: article.prix.toString()
      });
    }
  }, [article]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const updatedItem = {
        ...formData,
        prix: parseFloat(formData.prix),
        categories: formData.categories.split(',').map(c => c.trim()),
        dateModification: new Date().toISOString()
      };

      const { isValid, errors } = validateItem(updatedItem);
      
      if (!isValid) {
        setErrors(errors);
        return;
      }

      await updateItem(article.id, updatedItem);
      onEdit(updatedItem);
      onClose();
    } catch (error) {
      if (error.code === 'network-error') {
        setErrors({ submit: 'Erreur réseau. Veuillez vérifier votre connexion.' });
      } else {
        setErrors({ submit: 'Une erreur est survenue lors de la modification.' });
      }
      console.error('Erreur lors de la modification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Modifier l'Article</h2>
        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}
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

          {Object.keys(errors).map(key => (
            key !== 'submit' && (
              <div key={key} className="field-error">
                {errors[key]}
              </div>
            )
          ))}

          <div className="button-group">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              disabled={isSubmitting}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 