//Sign in Page
import React from 'react';
import { useAuth } from '../Nested/Context/authentication';
import styles from './signin.module.css';

export const SignIn = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className={styles.signInContainer}>
      <h1>Welcome to 3D Printers Hub</h1>
      <button onClick={loginWithGoogle} className={styles.signInButton}>
        Sign in with Google
      </button>
    </div>
  );
};
