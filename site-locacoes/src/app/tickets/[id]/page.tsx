import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTicketById } from '@/lib/tickets-api';
import { cookies } from 'next/headers';
import { User } from '@/types';
import { Button } from '@/components/Button'; // Importa o novo botão

export default async function TicketDetailsPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  return (
    <div className="max-w-4xl mx-auto"> {/* Adicionado max-width para melhor leitura */}
      <TicketDetails id={awaitedParams.id} />
    </div>
  );
}

async function TicketDetails({ id }: { id: string }) {
    const ticket = await getTicketById(id);
    const userData = (await cookies()).get('user_data')?.value;
    const user: User | null = userData ? JSON.parse(userData) : null;

    if (!ticket) {
        notFound();
    }

    const backHref = user?.role === 'admin' ? '/admin/tickets' : '/tickets';
    const backText = user?.role === 'admin' ? 'Voltar para Painel de Tickets' : 'Voltar para Meus Tickets';

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-neutral-200">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">{ticket.title}</h1>
                    <p className="text-sm text-neutral-500">
                        Aberto em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                    </p>
                </div>
                <span
                    className={`capitalize px-3 py-1 text-sm font-semibold rounded-full
                    ${ticket.status === 'aberto' ? 'bg-green-100 text-green-800' : ''}
                    ${ticket.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${ticket.status === 'fechado' ? 'bg-neutral-200 text-neutral-700' : ''}
                    `}
                >
                    {ticket.status.replace('_', ' ')}
                </span>
            </div>
            <div className="prose max-w-none text-neutral-800 leading-relaxed mb-6">
              <p>{ticket.description}</p>
            </div>
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
                <div className="flex space-x-3">
                    <Link href={`/tickets/${ticket.id}/edit`} passHref>
                        <Button variant="primary">Editar Ticket</Button>
                    </Link>
                    <Link href={`/tickets/${ticket.id}/comments`} passHref>
                        <Button variant="secondary">Ver Comentários</Button>
                    </Link>
                </div>
                <Link href={backHref} passHref>
                    <Button variant="link">&larr; {backText}</Button>
                </Link>
            </div>
        </div>
    );
}