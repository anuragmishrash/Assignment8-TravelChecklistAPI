import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logout } from '../services/authService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth context provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  // Login function to update context
  const login = (user) => {
    setCurrentUser(user);
  };

  // Logout function
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout: handleLogout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 