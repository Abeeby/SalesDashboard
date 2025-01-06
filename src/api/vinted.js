import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../auth/firebase';

export const syncVintedAccount = async (vintedEmail) => {
  const db = getFirestore();
  
  try {
    // Associer le compte Vinted à l'utilisateur Firebase
    await addDoc(collection(db, 'vintedAccounts'), {
      userId: auth.currentUser.uid,
      vintedEmail,
      createdAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};

export const getVintedItems = async () => {
  const db = getFirestore();
  
  try {
    const q = query(
      collection(db, 'products'), 
      where('userId', '==', auth.currentUser.uid),
      where('platform', '==', 'vinted')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
}; 