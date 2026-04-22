import { createContext, useContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  async function login(identification_number, password) {
    const data = await authApi.login(identification_number, password);
    localStorage.setItem('token', data.token);
    setUser(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  const isAdmin = user?.rol === 'Administrador';
  const isAuth = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
