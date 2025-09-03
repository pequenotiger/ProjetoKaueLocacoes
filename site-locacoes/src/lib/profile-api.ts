import { cookies } from 'next/headers';
import { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProfile(): Promise<User | null> {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!response.ok) return null;
        return response.json();
    } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        return null;
    }
}