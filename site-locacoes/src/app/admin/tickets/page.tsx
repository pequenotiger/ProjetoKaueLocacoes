import { cookies } from 'next/headers';
import { Ticket } from '@/types';
import Link from 'next/link';

interface AdminTicket extends Ticket {
    user_nome: string;
    product_name: string;
}

async function getAllTickets(): Promise<AdminTicket[]> {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return [];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/tickets`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error('Falha ao buscar todos os tickets:', res.statusText);
            return [];
        }
        return res.json();
    } catch (error) {
        console.error('Erro de rede ao buscar todos os tickets:', error);
        return [];
    }
}

export default async function AdminTicketsReportPage() {
  const tickets = await getAllTickets();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Tickets</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Todos os Tickets do Sistema</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Título</th>
                <th className="py-2 px-4 border-b text-left">Usuário</th>
                <th className="py-2 px-4 border-b text-left">Produto</th>
                <th className="py-2 px-4 border-b text-center">Status</th>
                <th className="py-2 px-4 border-b text-center">Data</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b font-medium">
                    <Link href={`/tickets/${ticket.id}/edit`} className="text-blue-600 hover:underline">
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">{ticket.user_nome}</td>
                  <td className="py-2 px-4 border-b">{ticket.product_name}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full
                      ${ticket.status === 'aberto' ? 'bg-green-100 text-green-800' : ''}
                      ${ticket.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${ticket.status === 'fechado' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tickets.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Nenhum ticket encontrado no sistema.</p>
        )}
      </div>
    </div>
  );
}