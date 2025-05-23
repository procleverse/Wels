
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, User, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/feed', label: 'Лента', icon: Home },
    { path: '/map', label: 'Карта', icon: Map },
    { path: '/create', label: 'Создать', icon: Plus },
    { path: '/stats', label: 'Статистика', icon: TrendingUp },
    { path: '/profile', label: 'Профиль', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-skate-primary to-skate-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <span className="text-xl font-bold text-skate-primary">RollerSocial</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      isActive 
                        ? "bg-skate-primary text-white" 
                        : "text-gray-600 hover:text-skate-primary"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 ${
                      isActive 
                        ? "text-skate-primary bg-blue-50" 
                        : "text-gray-600"
                    }`}
                  >
                    <Icon size={20} />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
