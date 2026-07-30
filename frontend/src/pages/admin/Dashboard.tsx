import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Briefcase, Award } from 'lucide-react';
import { apiClient } from '../../api/axios';

const StatCard = ({ title, value, icon: Icon, isLoading }: any) => (
  <div className="glass-card p-6 border border-white/5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className="w-16 h-16 text-tt-gold" />
    </div>
    <div className="relative z-10">
      <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-white">
        {isLoading ? (
          <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
        ) : (
          value
        )}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  // We'll fetch high-level stats here. For now we can fetch the total elements from the paginated endpoints.
  
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    refetchInterval: 60000,
    queryKey: ['admin', 'users'],
    queryFn: () => apiClient.get('/users').then(res => res.data.data),
  });

  const { data: blogsData, isLoading: loadingBlogs } = useQuery({
    refetchInterval: 60000,
    queryKey: ['admin', 'blogs'],
    queryFn: () => apiClient.get('/blogs?publicOnly=false').then(res => res.data.data),
  });

  const { data: brokersData, isLoading: loadingBrokers } = useQuery({
    refetchInterval: 60000,
    queryKey: ['admin', 'brokers'],
    queryFn: () => apiClient.get('/brokers').then(res => res.data.data),
  });

  const { data: propFirmsData, isLoading: loadingPropFirms } = useQuery({
    refetchInterval: 60000,
    queryKey: ['admin', 'prop-firms'],
    queryFn: () => apiClient.get('/prop-firms').then(res => res.data.data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-white/50 text-sm mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={usersData?.totalElements || 0} 
          icon={Users} 
          isLoading={loadingUsers} 
        />
        <StatCard 
          title="Blog Posts" 
          value={blogsData?.totalElements || 0} 
          icon={FileText} 
          isLoading={loadingBlogs} 
        />
        <StatCard 
          title="Listed Brokers" 
          value={brokersData?.totalElements || 0} 
          icon={Briefcase} 
          isLoading={loadingBrokers} 
        />
        <StatCard 
          title="Prop Firms" 
          value={propFirmsData?.totalElements || 0} 
          icon={Award} 
          isLoading={loadingPropFirms} 
        />
      </div>

      <div className="glass-card p-6 border border-white/5 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-tt-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Admin Dashboard Active</h2>
          <p className="text-white/50 max-w-md mx-auto">
            Use the sidebar to navigate through the different management modules.
          </p>
        </div>
      </div>
    </div>
  );
}
