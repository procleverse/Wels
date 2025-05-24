
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, User, Plus, TrendingUp, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { path: '/feed', label: 'Лента', icon: Home },
    { path: '/map', label: 'Карта', icon: Map },
    { path: '/create', label: 'Создать', icon: Plus },
    { path: '/stats', label: 'Статистика', icon: TrendingUp },
    { path: '/profile', label: 'Профиль', icon: User },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из аккаунта",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из аккаунта",
        variant: "destructive"
      });
    }
  };

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
            
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </Button>
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-red-600"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
