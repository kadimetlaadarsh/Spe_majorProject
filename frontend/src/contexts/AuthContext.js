import React, { createContext, useEffect, useState } from 'react';
import { setAuthToken } from '../api/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('erp_token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('erp_user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem('erp_token', token);
    else localStorage.removeItem('erp_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('erp_user', JSON.stringify(user));
    else localStorage.removeItem('erp_user');
  }, [user]);

  const login = (tokenValue, userObj) => {
    setToken(tokenValue);
    setUser(userObj);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
