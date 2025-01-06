import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBfIsadPOcK1Jp9KVMKAh4q7uS5mTs91s",
  authDomain: "dashboradsales.firebaseapp.com",
  databaseURL: "https://dashboradsales-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dashboradsales",
  storageBucket: "dashboradsales.firebasestorage.app",
  messagingSenderId: "239075945910",
  appId: "1:239075945910:web:760a63b2dcdf58629ba517",
  measurementId: "G-15XGJY5KGV"
};

let auth, db, storage, analytics;

try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialisé avec succès');
  
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  analytics = getAnalytics(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Utilisateur connecté:', user.email);
    } else {
      console.log('Utilisateur non connecté');
    }
  });
} catch (error) {
  console.error('Erreur d\'initialisation Firebase:', error);
  throw error;
}

export { auth, db, storage, analytics }; 