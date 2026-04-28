import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ClipboardList,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/agent',
    icon: LayoutDashboard,
  },
  {
    title: 'My Fields',
    href: '/agent/fields',
    icon: MapIcon,
  },
  {
    title: 'Field Updates',
    href: '/agent/updates',
    icon: ClipboardList,
  },
];

export const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Use auth store logout function
      await logout();
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const isActive = (href: string) => {
    if (href === '/agent') {
      return location.pathname === '/' || location.pathname === '/agent';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-emerald-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <MapIcon size={18} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">SmartSeason</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-emerald-800"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-100 hover:text-white hover:bg-emerald-800"
                  )}
                >
                  <Icon size={18} />
                  {item.title}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-emerald-800 p-4 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <MapIcon size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">Field Agent</div>
                <div className="text-emerald-200 text-xs">Agricultural Coordinator</div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-emerald-100 hover:text-white hover:bg-emerald-800"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-x-4 border-b border-stone-200 bg-white px-4 shadow-sm lg:px-8 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-stone-600"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-stone-900">
                {navItems.find(item => isActive(item.href))?.title || 'Agent Dashboard'}
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
