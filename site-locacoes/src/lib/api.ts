import axios from 'axios';
import Cookies from 'js-cookie';

// Idealmente, a URL da API também viria de uma variável de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

// Adiciona o token a todas as requisições autenticadas
api.interceptors.request.use((config) => {
    const token = Cookies.get('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});