"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Ticket } from '@/types';

// O formulário recebe o ticket como propriedade
export function EditTicketForm({ ticket }: { ticket: Ticket }) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Supondo que você tenha uma rota PUT /tickets/:id no backend
      await api.put(`/tickets/${ticket.id}`, { 
        title, 
        description, 
        status
      });
      // Sucesso! Volta para a página de detalhes do ticket
      router.push(`/tickets/${ticket.id}`);
      router.refresh(); // Atualiza os dados da página anterior
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar o ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Título</label>
        <input 
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descrição</label>
        <textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          rows={5}
          required
        />
      </div>

      <div className="mb-6">
          <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Ticket['status'])}
            className="w-full px-3 py-2 border rounded capitalize"
            required
          >
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
      
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
}