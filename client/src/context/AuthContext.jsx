// Auth context — manages authentication state, login, logout, and useAuth hook
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore auth state from localStorage
    try {
      const savedToken = localStorage.getItem('lc_token');
      const savedUser = localStorage.getItem('lc_user');

      if (savedToken && savedUser) {
        // Check if token is expired
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem('lc_token');
          localStorage.removeItem('lc_user');
        } else {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (err) {
      localStorage.removeItem('lc_token');
      localStorage.removeItem('lc_user');
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('lc_token', newToken);
    localStorage.setItem('lc_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('lc_token');
    localStorage.removeItem('lc_user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
