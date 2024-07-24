// src/components/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Nested/Context/authentication';

export const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
  
    if (currentUser === null) {
      return <Navigate to="/signin" />;
    }
  
    return children;
  };