import Link from 'next/link';
import { cookies } from 'next/headers';
import { TicketCard } from '@/components/TicketCard';
import { Ticket } from '@/types';

async function getTickets(): Promise<Ticket[]> {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) {
    console.error('Token não encontrado');
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      console.error('Falha ao buscar tickets:', response.statusText);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Erro de rede ao buscar tickets:', error);
    return [];
  }
}

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Tickets</h1>
        <Link href="/tickets/create" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
          Novo Ticket
        </Link>
      </div>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Você ainda não tem tickets registrados.</p>
        </div>
      )}
    </div>
  );
}