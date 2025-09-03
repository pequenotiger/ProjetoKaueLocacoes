"use client";

import { useState, FormEvent } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button'; // Importa o novo botão
import { useRouter } from 'next/navigation';

// Componente para um Card genérico
function Card({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-neutral-200">
            <div className="p-4 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}

export function ProfileForm({ user: initialUser }: { user: User }) {
    const { refreshUser } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false); // Estado para ocultar/exibir senha

    const handleInfoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const response = await api.put('/profile', { nome: user.nome, email: user.email });
            refreshUser(response.data); // Atualiza o usuário no AuthContext (e na Navbar)
            setMessage({ type: 'success', text: 'Informações atualizadas com sucesso!' });
        } catch (err) {
            if (err instanceof AxiosError) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao atualizar informações.' });
            } else {
                setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const response = await api.put('/profile/password', passwords);
            setMessage({ type: 'success', text: response.data.message });
            setPasswords({ currentPassword: '', newPassword: '' }); // Limpa os campos
            setShowPasswordFields(false); // Oculta a seção de senha após sucesso
        } catch (err) {
             if (err instanceof AxiosError) {
                setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao atualizar senha.' });
            } else {
                setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
             {message && (
                <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <Card title="Informações Pessoais">
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-neutral-700">Nome</label>
                        <input type="text" id="nome" value={user.nome} onChange={(e) => setUser({...user, nome: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
                        <input type="email" id="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            &larr; Voltar
                        </Button>
                        <Button type="submit" disabled={loading}>
                           {loading ? 'Salvando...' : 'Salvar Informações'}
                        </Button>
                    </div>
                </form>
            </Card>

            <Card title="Alterar Senha">
                {!showPasswordFields ? (
                    <Button variant="secondary" onClick={() => setShowPasswordFields(true)}>
                        Atualizar Senha
                    </Button>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword"  className="block text-sm font-medium text-neutral-700">Senha Atual</label>
                            <input type="password" id="currentPassword" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="newPassword"  className="block text-sm font-medium text-neutral-700">Nova Senha</label>
                            <input type="password" id="newPassword" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button type="button" variant="outline" onClick={() => { setShowPasswordFields(false); setPasswords({ currentPassword: '', newPassword: '' }); }}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} variant="primary">
                                {loading ? 'Alterando...' : 'Alterar Senha'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}