
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация запроса к API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в RollerSocial",
      });
      navigate('/feed');
    }, 1500);
  };

  return (
    <Layout showNavigation={false}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-skate-primary via-blue-600 to-skate-secondary">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-skate-primary">RS</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">RollerSocial</h1>
            <p className="text-blue-100">Социальная сеть для роллеров</p>
          </div>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-skate-primary">Вход в аккаунт</CardTitle>
              <CardDescription className="text-center">
                Войдите, чтобы делиться своими маршрутами и достижениями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Вход</TabsTrigger>
                  <TabsTrigger value="register">Регистрация</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-skate-primary hover:bg-blue-800"
                      disabled={isLoading}
                    >
                      {isLoading ? "Вход..." : "Войти"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                      <Input 
                        type="text" 
                        placeholder="Имя пользователя" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-skate-secondary hover:bg-orange-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
