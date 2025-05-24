
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, MapPin, Clock, Zap, Calendar } from 'lucide-react';
import { useUserStats } from '@/hooks/useUserProfile';
import { useRoutes } from '@/hooks/useRoutes';

export const Stats: React.FC = () => {
  const { stats } = useUserStats();
  const { routes } = useRoutes();

  const currentMonth = new Date().getMonth();
  const monthlyRoutes = routes.filter(route => 
    new Date(route.created_at).getMonth() === currentMonth
  );

  const monthlyDistance = monthlyRoutes.reduce((sum, route) => 
    sum + Number(route.distance || 0), 0
  );

  const monthlyTime = monthlyRoutes.reduce((sum, route) => 
    sum + Number(route.duration || 0), 0
  );

  const personalRecords = {
    maxSpeed: Math.max(...routes.map(r => r.max_speed || 0), 0),
    longestRide: Math.max(...routes.map(r => r.distance || 0), 0),
    longestTime: Math.max(...routes.map(r => r.duration || 0), 0)
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-skate-primary mb-2">Статистика</h1>
          <p className="text-gray-600">Отслеживайте свой прогресс и достижения</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="routes">Маршруты</TabsTrigger>
            <TabsTrigger value="goals">Цели</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Этот месяц</p>
                      <p className="text-2xl font-bold">{monthlyDistance.toFixed(1)} км</p>
                    </div>
                    <MapPin className="text-skate-primary" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    {monthlyRoutes.length} поездок
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Время катания</p>
                      <p className="text-2xl font-bold">{formatTime(monthlyTime)}</p>
                    </div>
                    <Clock className="text-skate-secondary" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">В этом месяце</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ср. скорость</p>
                      <p className="text-2xl font-bold">{stats?.averageSpeed?.toFixed(1) || 0} км/ч</p>
                    </div>
                    <Zap className="text-skate-accent" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">Общая средняя</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Поездки</p>
                      <p className="text-2xl font-bold">{routes.length}</p>
                    </div>
                    <Calendar className="text-blue-600" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">Всего записано</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="text-skate-primary" />
                  <span>Активность за месяц</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Calendar size={48} className="text-skate-primary mx-auto mb-4" />
                    <p className="text-gray-600">График активности будет доступен скоро</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Пока что: {monthlyRoutes.length} поездок в этом месяце
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>История маршрутов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-skate-primary to-skate-secondary rounded-lg flex items-center justify-center">
                          <MapPin className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">{route.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(route.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{route.distance} км</p>
                        <p className="text-sm text-gray-600">{formatTime(route.duration)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {routes.length === 0 && (
                    <div className="text-center py-8">
                      <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Пока нет записанных маршрутов</p>
                      <p className="text-sm text-gray-500">Начните запись в разделе "Карта"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Месячная цель</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Расстояние</span>
                        <span>{monthlyDistance.toFixed(1)} / 100 км</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-skate-primary to-skate-secondary h-2 rounded-full" 
                          style={{ width: `${Math.min(monthlyDistance, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Поездки</span>
                        <span>{monthlyRoutes.length} / 15</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-skate-secondary to-skate-accent h-2 rounded-full" 
                          style={{ width: `${Math.min((monthlyRoutes.length / 15) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Личные рекорды</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Максимальная скорость</span>
                      <span className="font-bold">{personalRecords.maxSpeed.toFixed(1)} км/ч</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Самая длинная поездка</span>
                      <span className="font-bold">{personalRecords.longestRide.toFixed(1)} км</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Самая долгая поездка</span>
                      <span className="font-bold">{formatTime(personalRecords.longestTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Stats;
