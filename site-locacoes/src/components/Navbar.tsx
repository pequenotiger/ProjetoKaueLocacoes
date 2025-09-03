"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './Button'; // Usaremos nosso botão estilizado

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const navLinkClasses = (path: string) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path 
        ? 'text-primary font-semibold' 
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
    }`;
  
  const mobileNavLinkClasses = (path: string) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      pathname === path
        ? 'bg-primary text-white'
        : 'text-neutral-700 hover:bg-neutral-100'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              KaueLocações
            </Link>
          </div>

          {/* Links para Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link href="/" className={navLinkClasses('/')}>Home</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className={navLinkClasses('/admin')}>Painel Admin</Link>
            )}
            {isAuthenticated && (
              <Link href="/tickets" className={navLinkClasses('/tickets')}>Meus Tickets</Link>
            )}
          </div>

          {/* Autenticação para Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link href="/profile" className={navLinkClasses('/profile')}>
                  Olá, {user?.nome.split(' ')[0]}
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="primary" size="sm">Registrar</Button>
                </Link>
              </>
            )}
          </div>

          {/* Botão do Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Abrir menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m4 6h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Expansível */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/')}>Home</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/admin')}>Painel Admin</Link>
            )}
            {isAuthenticated && (
              <Link href="/tickets" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/tickets')}>Meus Tickets</Link>
            )}
            <div className="border-t border-neutral-200 my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/profile')}>
                    Olá, {user?.nome.split(' ')[0]}
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                    Sair
                  </button>
                </>
              ) : (
                 <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/login')}>Login</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClasses('/register')}>Registrar</Link>
                 </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}