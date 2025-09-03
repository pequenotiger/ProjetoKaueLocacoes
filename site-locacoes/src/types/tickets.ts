export type Ticket = {
  id: number;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em_andamento' | 'aguardando' | 'resolvido' | 'fechado';
  usuario_id: number;
  criado_em: string;
  atualizado_em: string;
};

export type Comentario = {
  id: number;
  conteudo: string;
  usuario_id: number;
  ticket_id: number;
  criado_em: string;
  atualizado_em: string;
};