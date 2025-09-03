import { getProfile } from '@/lib/profile-api';
import { ProfileForm } from '@/components/ProfileForm';

// Componente de servidor que busca os dados iniciais
export default async function ProfilePage() {
  const user = await getProfile();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Meu Perfil</h1>
      
      {user ? (
        <ProfileForm user={user} />
      ) : (
        <p className="text-center text-red-500">Não foi possível carregar os dados do seu perfil.</p>
      )}
    </div>
  );
}