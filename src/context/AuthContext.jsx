import { createContext, useContext, useEffect, useState } from 'react';
import { saveUser, getUser, clearUser } from '../utils/localStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData, remember = true) => {
    setUser(userData);
    setIsAuthenticated(true);
    saveUser(userData, remember);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
