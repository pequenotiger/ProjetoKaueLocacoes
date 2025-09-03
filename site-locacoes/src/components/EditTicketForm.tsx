"use client";

// Importações do React e Next.js
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Importações de bibliotecas e tipos
import { AxiosError } from 'axios';
import { api } from '@/lib/api';
import { Ticket } from '@/types';
import { useAuth } from '@/context/AuthContext';

// Importação do nosso novo componente de botão estilizado
import { Button } from '@/components/Button';

// O componente recebe os dados iniciais do ticket como propriedade (props)
export function EditTicketForm({ ticket }: { ticket: Ticket }) {
  // Hooks para gerenciar o estado do componente
  const { user } = useAuth(); // Obtém o usuário logado para verificar se é admin
  const router = useRouter(); // Para redirecionamento após salvar

  // Estados para controlar os valores dos campos do formulário
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  
  // Estados para controlar o feedback da UI (carregamento e erros)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setError(null);
    setIsSubmitting(true);

    // Cria o objeto de dados a ser enviado para a API
    const payload: { title: string; description: string; status?: typeof status } = {
      title,
      description,
    };

    // Apenas administradores podem incluir o status no payload de atualização
    if (user?.role === 'admin') {
      payload.status = status;
    }

    try {
      // Envia a requisição PUT para a API para atualizar o ticket
      await api.put(`/tickets/${ticket.id}`, payload);
      // Em caso de sucesso, redireciona para a página de detalhes do ticket
      router.push(`/tickets/${ticket.id}`);
      router.refresh(); // Força a atualização dos dados na página de detalhes
    } catch (err) {
      // Tratamento de erro seguro
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro ao atualizar o ticket.');
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      // Garante que o estado de carregamento seja desativado, mesmo se houver erro
      setIsSubmitting(false);
    }
  };

  // Renderização do formulário
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md border border-neutral-200">
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">Título</label>
        <input 
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Descrição</label>
        <textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          rows={5}
          required
        />
      </div>

      {/* O campo de Status só é renderizado se o usuário logado for um admin */}
      {user?.role === 'admin' && (
        <div className="mb-6">
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700">Status (Admin)</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Ticket['status'])}
              className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm capitalize"
              required
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>
      )}
      
      {/* Seção de ações com os novos botões estilizados */}
      <div className="flex items-center justify-end space-x-4 mt-6 border-t border-neutral-200 pt-4">
        <Link href={`/tickets/${ticket.id}`} passHref>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  );
}