"use client";

import { useState } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function UserRow({ user }: { user: User }) {
  const [role, setRole] = useState(user.role);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  const handleRoleChange = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/admin/usuarios/${user.id}`, { role });
      setSuccess('Role atualizada com sucesso!');
      // Atualiza os dados da página para refletir a mudança
      router.refresh(); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao atualizar a role.');
    } finally {
      setIsSaving(false);
      // Limpa a mensagem de sucesso após alguns segundos
      setTimeout(() => setSuccess(''), 3000);
    }
  };
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="py-2 px-4 border-b text-center">{user.id}</td>
      <td className="py-2 px-4 border-b">{user.nome}</td>
      <td className="py-2 px-4 border-b">{user.email}</td>
      <td className="py-2 px-4 border-b text-center">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as User['role'])}
          className="p-1 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </td>
      <td className="py-2 px-4 border-b text-center">
        {new Date(user.created_at).toLocaleDateString('pt-BR')}
      </td>
      <td className="py-2 px-4 border-b text-center">
        <button
          onClick={handleRoleChange}
          disabled={isSaving || role === user.role}
          className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
        {success && <p className="text-green-600 text-xs mt-1">{success}</p>}
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </td>
    </tr>
  );
}