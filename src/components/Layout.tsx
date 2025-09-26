import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home, 
  Pickaxe, 
  Package, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  DollarSign,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Başarıyla çıkış yapıldı');
      navigate('/');
    } catch (error) {
      toast.error('Çıkış yapılırken hata oluştu');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/mining', label: 'Madencilik', icon: Pickaxe },
    { path: '/packages', label: 'Paketler', icon: Package },
    { path: '/withdrawal', label: 'Para Çekme', icon: DollarSign },
    { path: '/profile', label: 'Profil', icon: User },
    ...(user?.isAdmin ? [{ path: '/admin', label: 'Admin', icon: Shield }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800/50 backdrop-blur-md border-r border-gray-700">
          {/* Logo */}
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Pickaxe className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CloudMiner</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="flex-shrink-0 border-t border-gray-700 p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400">
                  ${user?.balance.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Pickaxe className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CloudMiner</span>
          </div>
          
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            aria-label="Menüyü aç"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 lg:hidden"
            onClick={closeMobileMenu}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            
            {/* Mobile Menu Panel */}
            <div 
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-800/95 backdrop-blur-md border-l border-gray-700 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Pickaxe className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">CloudMiner</span>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label="Menüyü kapat"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="px-4 py-4 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      Bakiye: ${user?.balance.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`group flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-gray-700/70 hover:text-white active:bg-gray-600'
                      }`}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="px-4 py-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="group flex w-full items-center px-3 py-3 text-base font-medium text-gray-300 rounded-lg hover:bg-red-600/80 hover:text-white active:bg-red-700 transition-all duration-200"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 z-40">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-gray-400 hover:text-white active:bg-gray-700/50'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
