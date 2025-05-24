
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user && !loading) {
      navigate('/feed');
    }
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Ошибка входа",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Добро пожаловать!",
        description: "Вы успешно вошли в RollerSocial",
      });
      navigate('/feed');
    }
    
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, username, fullName);
    
    if (error) {
      toast({
        title: "Ошибка регистрации",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Регистрация успешна!",
        description: "Добро пожаловать в RollerSocial",
      });
      navigate('/feed');
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <Layout showNavigation={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-skate-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Input 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        name="password"
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-skate-primary hover:bg-blue-800"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Вход..." : "Войти"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Input 
                        name="username"
                        type="text" 
                        placeholder="Имя пользователя" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        name="fullName"
                        type="text" 
                        placeholder="Полное имя" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <Input 
                        name="password"
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-skate-secondary hover:bg-orange-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
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
