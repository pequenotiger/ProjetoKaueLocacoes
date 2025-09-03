"use client";

import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import { Comment } from '@/types'; // Importando o tipo 'Comment' do arquivo central
import { AxiosError } from 'axios';

interface CommentSectionProps {
    ticketId: number;
    initialComments: Comment[];
}

export function CommentSection({ ticketId, initialComments }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await api.post<Comment>(`/tickets/${ticketId}/comments`, { content: newComment });
            setComments(prev => [...prev, response.data]);
            setNewComment('');
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || 'Erro ao adicionar comentário.');
            } else {
                setError('Ocorreu um erro inesperado.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Comentários</h2>
            
            <form onSubmit={handleSubmit} className="mb-6">
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded mb-2 text-black" // Adicionado text-black para visibilidade
                    rows={3}
                    placeholder="Adicione um comentário..."
                    required
                />
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400">
                    {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                Por: {comment.user_nome} - {new Date(comment.created_at).toLocaleString('pt-BR')}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum comentário ainda.</p>
                )}
            </div>
        </div>
    );
}