import Link from 'next/link';
import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <div className="text-center flex flex-col items-center justify-center py-16 sm:py-24">
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
        <span className="block">Gestão de Locações</span>
        <span className="block text-primary">Simples e Eficiente</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-neutral-600 sm:text-xl">
        A plataforma definitiva para gerenciar suas locações, tickets e suporte técnico de forma integrada e descomplicada.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4 w-full max-w-xs mx-auto">
        <Link href="/register" passHref className="w-full">
          <Button size="lg" fullWidth>Comece Agora</Button>
        </Link>
        <Link href="/login" passHref className="w-full">
          <Button size="lg" variant="outline" fullWidth>Fazer Login</Button>
        </Link>
      </div>
    </div>
  );
}