// Authentication Context 
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider, db } from '../../../firebaseConfig.js';
import { collection, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Authentication Context
const AuthContext = createContext();
// Authentication Context Provider
export const useAuth = () => useContext(AuthContext);
// Auth Provider Method
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      if (user) {
        navigate('/');
      }
    });
    return unsubscribe;
}, [navigate]);
// Google Sign In
const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Save user details to Firestore
    const userDoc = doc(collection(db, "users"), user.uid);
    await setDoc(userDoc, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }, { merge: true });
};
// Google Log Out
const logout = async () => {
    if (currentUser) {
      const userDoc = doc(collection(db, "users"), currentUser.uid);
      await deleteDoc(userDoc);  // Delete user document from Firestore
    }
    await signOut(auth);
    setCurrentUser(null); // Clear the user state
    navigate('/signin');
};
// Auth Context Provider
return (
    <AuthContext.Provider value={{ currentUser, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
