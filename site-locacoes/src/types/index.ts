export interface User {
  id: number;
  nome: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'aberto' | 'fechado' | 'em_andamento';
  user_id: number;
  product_id: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
}

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_nome: string;
}