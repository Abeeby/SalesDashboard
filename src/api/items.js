import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../auth/firebase';

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: itemData.status || 'disponible',
      vues: 0,
      favoris: 0,
      prix: parseFloat(itemData.prix) || 0,
      categories: Array.isArray(itemData.categories) 
        ? itemData.categories 
        : itemData.categories.split(',').map(c => c.trim()),
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
    throw new Error(error.message || 'Erreur lors de l\'ajout de l\'article');
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
    throw error;
  }
};

export const deleteItem = async (itemId) => {
  const db = getFirestore();
  try {
    await deleteDoc(doc(db, 'items', itemId));
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

export const updateItem = async (itemId, itemData) => {
  const db = getFirestore();
  try {
    const itemRef = doc(db, 'items', itemId);
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