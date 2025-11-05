import { createContext, useContext, useEffect, useState } from 'react';
import { saveUser, getUser, clearUser } from '../utils/localStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    console.log("🔄 Restoring user from localStorage:", storedUser);

    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setIsAuthLoading(false);
  }, []);

  const login = (userData, remember = true) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (remember) saveUser(userData, remember);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
