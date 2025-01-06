import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBfIsadPOoKljp9KVMKAh4gq7uS5mTs9ls",
  authDomain: "dashboradsales.firebaseapp.com",
  databaseURL: "https://dashboradsales-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dashboradsales",
  storageBucket: "dashboradsales.firebasestorage.app",
  messagingSenderId: "239075945910",
  appId: "1:239075945910:web:760a63b2dcdf58629ba517",
  measurementId: "G-15XGJY5KGV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics }; 