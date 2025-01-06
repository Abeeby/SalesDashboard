import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../auth/firebase';

// Ajouter un item
export const addItem = async (itemData) => {
  const db = getFirestore();
  try {
    await addDoc(collection(db, 'items'), {
      ...itemData,
      userId: auth.currentUser.uid,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'item:', error);
    throw error;
  }
};

// Récupérer les items
export const getItems = async () => {
  const db = getFirestore();
  try {
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
    console.error('Erreur lors de la récupération des items:', error);
    throw error;
  }
}; 