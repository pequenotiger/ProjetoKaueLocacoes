import { cookies } from 'next/headers';
import { User } from '@/types';
import { UserRow } from '@/components/UserRow';

async function getAllUsers(): Promise<User[]> {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return [];

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/usuarios`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Falha ao buscar usuários:', response.statusText);
            return [];
        }
        return response.json();
    } catch (error) {
        console.error('Erro de rede ao buscar usuários:', error);
        return [];
    }
}

export default async function AdminDashboardPage() {
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard do Administrador</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Gerenciamento de Usuários</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b text-left">Nome</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Data de Criação</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Nenhum usuário encontrado.</p>
        )}
      </div>
    </div>
  );
}