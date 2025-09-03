import { cookies } from 'next/headers';

// Simula a busca de dados para o dashboard
async function getDashboardData() {
    const token = (await cookies()).get('auth_token')?.value;
    if (!token) return { totalUsers: 0, recentTickets: [], unansweredTickets: 0, lastUserDate: null };

    // Em um projeto real, você criaria rotas no backend para buscar esses dados
    // Por agora, vamos simular com dados estáticos
    return {
        totalUsers: 15,
        recentTickets: [
            { id: 1, title: "Projetor não liga", user: "Carlos Silva" },
            { id: 2, title: "Impressora com falha", user: "Ana Paula" },
        ],
        unansweredTickets: 2,
        lastUserDate: new Date().toISOString()
    };
}

// Componente de Card para o Dashboard
function StatCard({ title, value, description }: { title: string; value: string | number; description: string }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <p className="text-gray-400 text-xs mt-1">{description}</p>
        </div>
    );
}

export default async function AdminDashboardPage() {
    const data = await getDashboardData();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard do Administrador</h1>
            
            {/* Seção de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Total de Usuários" 
                    value={data.totalUsers} 
                    description={`Último cadastro em ${data.lastUserDate ? new Date(data.lastUserDate).toLocaleDateString('pt-BR') : 'N/A'}`} 
                />
                <StatCard 
                    title="Tickets Pendentes" 
                    value={data.unansweredTickets} 
                    description="Tickets abertos há mais de 24h" 
                />
                <StatCard 
                    title="Visitas Hoje" 
                    value="1,234" 
                    description="Monitoramento de acesso (simulado)"
                />
            </div>

            {/* Seção de Tickets Recentes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tickets Recentes</h2>
                <ul>
                    {data.recentTickets.map(ticket => (
                        <li key={ticket.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                            <span>{ticket.title}</span>
                            <span className="text-sm text-gray-500">{ticket.user}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}