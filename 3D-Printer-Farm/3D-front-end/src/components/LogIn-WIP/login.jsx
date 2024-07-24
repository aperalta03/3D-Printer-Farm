import React, { useState } from 'react';
import { useAuth } from '../Nested/Context/authentication';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';

export const LogIn = () => {
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.logInContainer}>
      <h1>Welcome to 3D Printers Hub</h1>
      <form onSubmit={handleLogIn} className={styles.form}>
        <input
          type="email"
          placeholder="Enter your @openhub.be email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <div className={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.showPasswordButton}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className={styles.logInButton}>
          Log In
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <p className={styles.signupLink}>
        Don't have an account?{' '}
        <Link to="/signup" className={styles.linkButton}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};
