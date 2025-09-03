import { notFound } from 'next/navigation';
import { getUserById, getTicketsByUserId } from '@/lib/admin-api'; 
import { TicketCard } from '@/components/TicketCard';

export default async function AdminUserTicketsPage({ params }: { params: { id: string } }) {
  // A correção definitiva está aqui: aguardamos o objeto params
  const awaitedParams = await params;
  
  return <UserTicketsView userId={awaitedParams.id} />;
}

async function UserTicketsView({ userId }: { userId: string }) {
  const [user, tickets] = await Promise.all([
    getUserById(userId),
    getTicketsByUserId(userId),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Tickets de {user.nome}</h1>
      <p className="text-gray-600 mb-6">Visualizando todos os tickets para o usuário ID: {user.id}</p>

      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Este usuário ainda não registrou nenhum ticket.</p>
        </div>
      )}
    </div>
  );
}