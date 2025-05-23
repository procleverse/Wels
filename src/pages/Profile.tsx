
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Zap, Trophy, Calendar, Users } from 'lucide-react';

export const Profile: React.FC = () => {
  const stats = [
    { label: 'Общее расстояние', value: '247.8 км', icon: MapPin },
    { label: 'Время катания', value: '24ч 15м', icon: Clock },
    { label: 'Средняя скорость', value: '18.2 км/ч', icon: Zap },
    { label: 'Маршруты', value: '23', icon: Calendar },
  ];

  const achievements = [
    { name: 'Первые 10 км', icon: Trophy, earned: true },
    { name: 'Скоростной демон', icon: Zap, earned: true },
    { name: 'Марафонец', icon: MapPin, earned: false },
    { name: 'Ночной райдер', icon: Clock, earned: true },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Профиль */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-skate-primary to-skate-secondary text-white">
                  АК
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold mb-2">Анна Катается</h1>
                <p className="text-gray-600 mb-3">@anna_skates</p>
                <p className="text-gray-700 mb-4">
                  Люблю кататься на роликах по городу 🛼 Всегда в поиске новых маршрутов и компании для катания!
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary">Москва</Badge>
                  <Badge variant="secondary">Фрискейт</Badge>
                  <Badge variant="secondary">Городское катание</Badge>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button>Редактировать профиль</Button>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Users size={16} />
                  <span>156 подписчиков</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <Icon size={24} className="text-skate-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Достижения */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-skate-secondary" />
              <span>Достижения</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border text-center ${
                      achievement.earned
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Icon
                      size={32}
                      className={`mx-auto mb-2 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`}
                    />
                    <p className={`text-sm font-medium ${
                      achievement.earned ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Последние маршруты */}
        <Card>
          <CardHeader>
            <CardTitle>Последние маршруты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((route) => (
                <div key={route} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Прокатка по набережной</h4>
                    <p className="text-sm text-gray-600">2 дня назад</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-skate-primary">12.5 км</p>
                    <p className="text-sm text-gray-600">45 мин</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
