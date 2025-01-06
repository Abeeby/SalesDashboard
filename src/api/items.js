import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../auth/firebase';

// Ajouter un item
export const addItem = async (itemData) => {
  const db = getFirestore();
  try {
    if (!auth.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    const docRef = await addDoc(collection(db, 'items'), {
      ...itemData,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return {
      id: docRef.id,
      ...itemData
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