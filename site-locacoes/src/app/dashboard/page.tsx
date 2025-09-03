import { TicketCard } from '@/components/TicketCard';
import { Ticket } from '@/types';
import { cookies } from 'next/headers';

async function getTickets(token: string | undefined): Promise<Ticket[]> {
  if (!token) return [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!response.ok) {
        return [];
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const token = (await cookies()).get('auth_token')?.value;
  const tickets = await getTickets(token);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Seu Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Tickets Recentes</h2>
      
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <p>Você ainda não criou nenhum ticket.</p>
      )}
    </div>
  );
}