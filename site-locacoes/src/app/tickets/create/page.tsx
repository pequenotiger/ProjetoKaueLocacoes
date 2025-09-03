"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';

export default function CreateTicketPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productId, setProductId] = useState<number | ''>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const response = await api.get('/produtos');
        setProducts(response.data);
      } catch (err) {
        setError('Não foi possível carregar os produtos.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('Por favor, selecione um produto.');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/tickets', { 
        title, 
        description, 
        product_id: productId 
      });
      router.push('/tickets');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar o ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loadingProducts) {
    return <div className="container mx-auto p-4">Carregando produtos...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Ticket</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
        
        <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Título</label>
            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Descrição</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={4} required></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="product" className="block text-gray-700 font-semibold mb-2">Produto</label>
          <select
            id="product"
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="" disabled>Selecione um produto</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Criar Ticket'}
        </button>
      </form>
    </div>
  );
}