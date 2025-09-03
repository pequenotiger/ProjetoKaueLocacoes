import { notFound } from 'next/navigation';
import { getTicketById } from '@/lib/tickets-api';
import { EditTicketForm } from '@/components/EditTicketForm';
import Link from 'next/link';
import { Button } from '@/components/Button'; // Importa o novo botão

export default async function EditTicketPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  return (
    <div className="max-w-4xl mx-auto">
        <EditTicket id={awaitedParams.id} />
    </div>
  );
}

async function EditTicket({ id }: { id: string }) {
    const ticket = await getTicketById(id);

    if (!ticket) {
        notFound();
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-neutral-900 mb-6">Editar Ticket #{ticket.id}</h1>
            <EditTicketForm ticket={ticket} />
            <div className="mt-6 flex justify-end">
                 <Link href={`/tickets/${ticket.id}`} passHref>
                     <Button variant="outline">&larr; Voltar para Detalhes</Button>
                 </Link>
            </div>
        </>
    );
}