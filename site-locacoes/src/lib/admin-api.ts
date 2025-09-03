import { cookies } from 'next/headers';
import { User, Ticket } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Função auxiliar para obter o token de autenticação
async function getAuthToken() {
    return (await cookies()).get('auth_token')?.value;
}

// Busca os dados de um usuário específico pelo ID (requer permissão de admin)
export async function getUserById(id: string): Promise<User | null> {
    const token = await getAuthToken();
    if (!token) return null;

    try {
        const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        return null;
    }
}

// Busca todos os tickets de um usuário específico pelo ID (requer permissão de admin)
export async function getTicketsByUserId(id: string): Promise<Ticket[]> {
    const token = await getAuthToken();
    if (!token) return [];

    try {
        const res = await fetch(`${API_URL}/admin/usuarios/${id}/tickets`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(`Erro ao buscar tickets para o usuário com ID ${id}:`, error);
        return [];
    }
}