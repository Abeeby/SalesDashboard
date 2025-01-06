export const validateItem = (item) => {
  const errors = {};

  if (!item.nom || item.nom.trim().length < 3) {
    errors.nom = 'Le nom doit contenir au moins 3 caractères';
  }

  if (!item.prix || isNaN(item.prix) || item.prix <= 0) {
    errors.prix = 'Le prix doit être un nombre positif';
  }

  if (!item.marque || item.marque.trim().length < 2) {
    errors.marque = 'La marque doit contenir au moins 2 caractères';
  }

  if (!item.categories || !Array.isArray(item.categories) || item.categories.length === 0) {
    errors.categories = 'Au moins une catégorie est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 