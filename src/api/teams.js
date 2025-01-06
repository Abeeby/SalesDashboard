import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../auth/firebase';

// Créer une équipe
export const createTeam = async (teamName) => {
  const db = getFirestore();
  try {
    const docRef = await addDoc(collection(db, 'teams'), {
      name: teamName,
      ownerId: auth.currentUser.uid,
      members: [{
        userId: auth.currentUser.uid,
        role: 'owner',
        email: auth.currentUser.email
      }],
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'équipe:', error);
    throw error;
  }
};

// Inviter un membre
export const inviteMember = async (teamId, email) => {
  const db = getFirestore();
  try {
    await addDoc(collection(db, 'invitations'), {
      teamId,
      email,
      status: 'pending',
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de l\'invitation:', error);
    throw error;
  }
};

// Ajouter un compte Vinted à l'équipe
export const addVintedAccount = async (teamId, vintedEmail, vintedUsername) => {
  const db = getFirestore();
  try {
    await addDoc(collection(db, 'vintedAccounts'), {
      teamId,
      vintedEmail,
      vintedUsername,
      addedBy: auth.currentUser.uid,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du compte Vinted:', error);
    throw error;
  }
};

// Récupérer les équipes de l'utilisateur
export const getUserTeams = async () => {
  const db = getFirestore();
  try {
    const q = query(
      collection(db, 'teams'),
      where('members', 'array-contains', { 
        userId: auth.currentUser.uid,
        role: 'owner',
        email: auth.currentUser.email 
      })
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erreur lors de la récupération des équipes:', error);
    throw error;
  }
}; 