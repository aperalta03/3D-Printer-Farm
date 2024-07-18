import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, addDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDmH6MlvSDMt57Qr0guB4Zd6sVlDeemZ8s",
    authDomain: "dprintershub-4f167.firebaseapp.com",
    projectId: "dprintershub-4f167",
    storageBucket: "dprintershub-4f167.appspot.com",
    messagingSenderId: "825292251990",
    appId: "1:825292251990:web:f88922ea36f11bbe22ecf7",
    measurementId: "G-EQVX8N8C01"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export { doc, getDoc, addDoc, deleteDoc, collection, query, where, getDocs }; // Export Firestore functions
