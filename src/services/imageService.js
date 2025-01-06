import { storage } from '../auth/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export const imageService = {
  uploadImage: async (file, itemId) => {
    if (!file) return null;

    try {
      // Créer un nom unique pour l'image
      const timestamp = Date.now();
      const fileName = `${itemId}_${timestamp}_${file.name}`;
      const storageRef = ref(storage, `items/${fileName}`);

      // Upload du fichier
      await uploadBytes(storageRef, file);

      // Récupérer l'URL de téléchargement
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
  },

  generateThumbnail: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Définir la taille de la miniature
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;

          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(resolve, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  deleteImage: async (imageUrl) => {
    if (!imageUrl) return;

    try {
      // Extraire le chemin du fichier de l'URL
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw new Error('Erreur lors de la suppression de l\'image');
    }
  },

  // Fonction utilitaire pour extraire le nom du fichier d'une URL
  getFileNameFromUrl: (url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.split('/').pop().split('?')[0];
    } catch {
      return null;
    }
  }
}; 