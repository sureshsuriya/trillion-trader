import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FolderTree, 
  Briefcase, 
  Award,
  Download,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: GraduationCap, label: 'Courses', href: '/admin/courses' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'Blog Posts', href: '/admin/blogs' },
  { icon: FolderTree, label: 'Categories', href: '/admin/categories' },
  { icon: Briefcase, label: 'Brokers', href: '/admin/brokers' },
  { icon: Award, label: 'Prop Firms', href: '/admin/prop-firms' },
  { icon: Download, label: 'Resources', href: '/admin/resources' },
  { icon: MessageSquare, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: HelpCircle, label: 'FAQs', href: '/admin/faqs' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-tt-black border-r border-tt-gold/10 hidden md:flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-tt-gold/10">
        <Link to="/" className="font-heading text-xl font-bold text-tt-gold">
          TT369 Admin
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 group ${
                  isActive 
                    ? 'bg-tt-gold/10 text-tt-gold font-medium' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${isActive ? 'text-tt-gold' : 'text-white/40 group-hover:text-white/70'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-tt-gold/10">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}
