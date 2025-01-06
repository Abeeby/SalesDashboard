import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth } from '../auth/firebase';
import { imageService } from '../services/imageService';

// Ajouter un item
export const addItem = async (itemData) => {
  const db = getFirestore();
  try {
    if (!auth.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    // Formatage des données avant l'ajout
    const formattedData = {
      ...itemData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: itemData.status || 'disponible',
      vues: 0,
      favoris: 0,
      prix: parseFloat(itemData.prix) || 0,
      categories: Array.isArray(itemData.categories) 
        ? itemData.categories 
        : itemData.categories.split(',').map(c => c.trim()).filter(Boolean),
    };

    // Validation des données requises
    if (!formattedData.nom || formattedData.nom.trim() === '') {
      throw new Error('Le nom est requis');
    }

    if (formattedData.prix <= 0) {
      throw new Error('Le prix doit être supérieur à 0');
    }

    const docRef = await addDoc(collection(db, 'items'), formattedData);

    return {
      id: docRef.id,
      ...formattedData
    };
  } catch (error) {
    console.error('Erreur lors de l\'ajout:', error);
    throw error;
  }
};

// Récupérer les items
export const getItems = async () => {
  const db = getFirestore();
  try {
    if (!auth.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    const q = query(
      collection(db, 'items'),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return [];
  }
};

export const deleteItem = async (itemId) => {
  const db = getFirestore();
  try {
    // Récupérer d'abord l'article pour avoir l'URL de l'image
    const itemRef = doc(db, 'items', itemId);
    const itemSnap = await getDoc(itemRef);
    
    if (itemSnap.exists()) {
      const itemData = itemSnap.data();
      
      // Supprimer l'image si elle existe
      if (itemData.imageUrl) {
        await imageService.deleteImage(itemData.imageUrl);
      }
      
      // Supprimer l'article
      await deleteDoc(itemRef);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

export const updateItem = async (itemId, itemData) => {
  const db = getFirestore();
  try {
    const itemRef = doc(db, 'items', itemId);
    const oldItemSnap = await getDoc(itemRef);
    
    if (oldItemSnap.exists()) {
      const oldItemData = oldItemSnap.data();
      
      // Si une nouvelle image est fournie et qu'il y avait une ancienne image
      if (itemData.imageUrl && oldItemData.imageUrl && itemData.imageUrl !== oldItemData.imageUrl) {
        // Supprimer l'ancienne image
        await imageService.deleteImage(oldItemData.imageUrl);
      }
    }
    
    await updateDoc(itemRef, {
      ...itemData,
      updatedAt: new Date(),
      updatedBy: auth.currentUser.uid
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    throw error;
  }
}; 