import { notFound } from 'next/navigation';
import { getTicketById, getCommentsForTicket } from '@/lib/tickets-api';
import { CommentSection } from '@/components/CommentSection';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { User } from '@/types';
import { Button } from '@/components/Button'; // Importa o novo botão

export default async function TicketCommentsPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  return (
    <div className="max-w-4xl mx-auto">
        <TicketComments id={awaitedParams.id} />
    </div>
  );
}

async function TicketComments({ id }: { id: string }) {
    const [ticket, comments] = await Promise.all([
        getTicketById(id),
        getCommentsForTicket(id)
    ]);

    const userData = (await cookies()).get('user_data')?.value;
    const user: User | null = userData ? JSON.parse(userData) : null;

    if (!ticket) {
        notFound();
    }

    const backHref = user?.role === 'admin' ? '/admin/tickets' : '/tickets';
    const backText = user?.role === 'admin' ? 'Voltar para Painel de Tickets' : 'Voltar para Meus Tickets';

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-neutral-200">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Comentários para: {ticket.title}</h1>
            <p className="text-neutral-600 mb-6">{ticket.description}</p>
            <hr className="my-6 border-neutral-200"/>
            <CommentSection ticketId={ticket.id} initialComments={comments} />
            <div className="mt-6 border-t pt-4 flex justify-end">
                <Link href={backHref} passHref>
                    <Button variant="link">&larr; {backText}</Button>
                </Link>
            </div>
        </div>
    );
}