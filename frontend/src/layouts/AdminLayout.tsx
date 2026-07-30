import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../contexts/AuthContext';

export function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-tt-black/95 text-white flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-tt-black border-b border-tt-gold/10 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden">
            <span className="font-heading font-bold text-tt-gold">TT369 Admin</span>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-white/50">{user?.roles.join(', ')}</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-tt-gold/20 border border-tt-gold/30 flex items-center justify-center text-tt-gold font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0a0a0a] p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
