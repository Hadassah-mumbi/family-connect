import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxX0a1ech_97GSaLp-f3fbll9nhNs-oi8",
  authDomain: "family-connect-2b330.firebaseapp.com",
  projectId: "family-connect-2b330",
  storageBucket: "family-connect-2b330.firebasestorage.app",
  messagingSenderId: "549224545541",
  appId: "1:549224545541:web:d24bd7d7e371294001cb6c",
  measurementId: "G-1YX53MGERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services we'll use
export const auth = getAuth(app);      // For authentication (login/signup)
export const db = getFirestore(app);   // For database (Firestore)
export const storage = getStorage(app); // For storing voice recordings

export default app;