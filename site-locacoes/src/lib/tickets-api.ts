import { cookies } from 'next/headers';
import { Ticket, Comment } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Função auxiliar para obter o token de autenticação
async function getAuthToken() {
    return (await cookies()).get('auth_token')?.value;
}

// Busca um ticket específico pelo ID
export async function getTicketById(id: string): Promise<Ticket | null> {
    const token = await getAuthToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/tickets/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error(`Erro ao buscar ticket com ID ${id}:`, error);
        return null;
    }
}

// Busca os comentários de um ticket específico
export async function getCommentsForTicket(id: string): Promise<Comment[]> {
    const token = await getAuthToken();
    if (!token) return [];

    try {
        const response = await fetch(`${API_URL}/tickets/${id}/comments`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error(`Erro ao buscar comentários para o ticket ${id}:`, error);
        return [];
    }
}