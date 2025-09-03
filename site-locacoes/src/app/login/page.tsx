"use client";

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, senha: password });
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg border border-neutral-200">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Ainda não tem uma?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
              Crie uma conta
            </Link>
          </p>
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password"  className="block text-sm font-medium text-neutral-700">Senha</label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}