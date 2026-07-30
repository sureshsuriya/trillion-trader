import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: string;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tt-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-tt-gold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && !user.roles.includes(requiredRole)) {
    // If they are logged in but not an admin, send them home
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
