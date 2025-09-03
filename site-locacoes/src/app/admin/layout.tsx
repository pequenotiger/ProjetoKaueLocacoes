"use client";

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Painel Admin</h2>
        <nav>
          <ul>
            <li>
              <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/usuarios" className="block py-2 px-4 rounded hover:bg-gray-700">
                Usuários
              </Link>
            </li>
            <li>
              <Link href="/admin/tickets" className="block py-2 px-4 rounded hover:bg-gray-700">
                Todos os Tickets
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}