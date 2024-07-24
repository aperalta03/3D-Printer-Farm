import React, { useState } from 'react';
import styles from './signup.module.css';
import { useAuth } from '../Nested/Context/authentication';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const { signUpWithEmail } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await signUpWithEmail(email, password); 
      navigate('/');
    } catch (error) {
      setMessage(`Failed to create an account. Error: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.signUpContainer}>
      <h1>Create Account</h1>
      <form onSubmit={handleSignUp} className={styles.signUpForm}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.togglePasswordButton}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <label>Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.togglePasswordButton}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {message && <p className={styles.message}>{message}</p>}
        <button type="submit" className={styles.signUpButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
