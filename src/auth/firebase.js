import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBfIsadPOcK1Jp9KVMKAh4q7uS5mTs91s",
  authDomain: "dashboradsales.firebaseapp.com",
  projectId: "dashboradsales",
  storageBucket: "dashboradsales.firebasestorage.app",
  messagingSenderId: "239075945910",
  appId: "1:239075945910:web:760a63b2dcdf58629ba517",
  measurementId: "G-15XGJY5KGV"
};

console.log('Initialisation de Firebase avec config:', {
  ...firebaseConfig,
  apiKey: '[MASQUÉ]'
});

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics }; 