// src/components/Layout.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Package, User, Settings, LogOut, Pickaxe, DollarSign, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Mining', href: '/mining', icon: Pickaxe },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'Withdrawal', href: '/withdrawal', icon: DollarSign },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (user?.isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Desktop Navigation */}
      <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Pickaxe className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">CloudMiner</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Info & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* User Balance - Hidden on small screens */}
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-300 truncate max-w-40">{user?.email}</p>
                <p className="text-xs text-blue-400">${user?.balance.toFixed(2)}</p>
              </div>
              
              {/* Desktop Logout */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-700 bg-gray-800/50 backdrop-blur-md">
            <div className="px-4 py-4 space-y-2">
              {/* User Info Mobile */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                <div>
                  <p className="text-sm text-gray-300 truncate">{user?.email}</p>
                  <p className="text-xs text-blue-400">Balance: ${user?.balance.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'text-blue-400 bg-blue-400/10'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-md font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation - Only for main pages */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700 z-50">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navigation.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-1 rounded-md transition-colors ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1 truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};