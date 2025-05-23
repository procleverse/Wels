
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, MapPin, Clock, Zap, Calendar } from 'lucide-react';

export const Stats: React.FC = () => {
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
            {/* Основная статистика */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Этот месяц</p>
                      <p className="text-2xl font-bold">89.2 км</p>
                    </div>
                    <MapPin className="text-skate-primary" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">+15% к прошлому месяцу</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Время катания</p>
                      <p className="text-2xl font-bold">12ч 34м</p>
                    </div>
                    <Clock className="text-skate-secondary" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">+8% к прошлому месяцу</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ср. скорость</p>
                      <p className="text-2xl font-bold">18.7 км/ч</p>
                    </div>
                    <Zap className="text-skate-accent" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">+2.1 км/ч</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Поездки</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Calendar className="text-blue-600" size={32} />
                  </div>
                  <p className="text-sm text-green-600 mt-2">+5 поездок</p>
                </CardContent>
              </Card>
            </div>

            {/* График активности (заглушка) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="text-skate-primary" />
                  <span>Активность за месяц</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Здесь будет график активности</p>
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
                  {[1, 2, 3, 4, 5].map((route) => (
                    <div key={route} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-skate-primary to-skate-secondary rounded-lg flex items-center justify-center">
                          <MapPin className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="font-medium">Маршрут #{route}</h4>
                          <p className="text-sm text-gray-600">{route} дня назад</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">12.{route} км</p>
                        <p className="text-sm text-gray-600">4{route} мин</p>
                      </div>
                    </div>
                  ))}
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
                        <span>89.2 / 100 км</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-skate-primary to-skate-secondary h-2 rounded-full" style={{ width: '89.2%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Время</span>
                        <span>12.5 / 15 часов</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-skate-secondary to-skate-accent h-2 rounded-full" style={{ width: '83.3%' }}></div>
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
                      <span className="font-bold">28.4 км/ч</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Самая длинная поездка</span>
                      <span className="font-bold">23.7 км</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Самая долгая поездка</span>
                      <span className="font-bold">1ч 47м</span>
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
