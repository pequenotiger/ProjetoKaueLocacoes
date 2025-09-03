import Link from 'next/link';
import { Ticket } from '@/types';
import { Button } from '@/components/Button'; // Importa o novo botão

interface TicketCardProps {
  ticket: Ticket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">{ticket.title}</h3>
        <p className="text-sm text-neutral-500 mb-3">
          Aberto em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-neutral-700 text-sm mb-4 line-clamp-3">{ticket.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
        <span
          className={`capitalize px-2 py-0.5 text-xs font-semibold rounded
          ${ticket.status === 'aberto' ? 'bg-green-100 text-green-800' : ''}
          ${ticket.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${ticket.status === 'fechado' ? 'bg-neutral-200 text-neutral-700' : ''}
          `}
        >
          {ticket.status.replace('_', ' ')}
        </span>
        <Link href={`/tickets/${ticket.id}`} passHref>
          <Button variant="link" size="sm">Ver Detalhes &rarr;</Button>
        </Link>
      </div>
    </div>
  );
}