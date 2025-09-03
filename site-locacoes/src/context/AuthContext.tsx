"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import Cookies from 'js-cookie';
import { api } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  // Adicionamos uma função para recarregar os dados do usuário
  refreshUser: (updatedUser: User) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('user_data');
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Atualiza a instância do axios com o token no carregamento inicial
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        setUser(parsedUser);
      } catch (e) {
        console.error("Falha ao analisar os dados do usuário dos cookies", e);
        logout();
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    const cookieOptions = { expires: 1, secure: process.env.NODE_ENV === 'production' };
    setUser(userData);
    Cookies.set('auth_token', token, cookieOptions);
    Cookies.set('user_data', JSON.stringify(userData), cookieOptions);
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    delete api.defaults.headers['Authorization'];
  };

  // Nova função para atualizar os dados do usuário no contexto e nos cookies
  const refreshUser = (updatedUser: User) => {
    setUser(updatedUser);
    Cookies.set('user_data', JSON.stringify(updatedUser), { expires: 1, secure: process.env.NODE_ENV === 'production' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};