import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Clock, Zap, Trophy, Calendar, Users, Flame, Target, Camera, Edit2 } from 'lucide-react';
import { useUserProfile, useUserStats } from '@/hooks/useUserProfile';
import { useRoutes } from '@/hooks/useRoutes';
import { useStreaks } from '@/hooks/useStreaks';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { stats } = useUserStats();
  const { routes } = useRoutes();
  const { streakData } = useStreaks();
  const { rewards } = useRewards();
  const { updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: profile?.username || '',
    fullName: profile?.full_name || '',
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      username: editForm.username,
      fullName: editForm.fullName,
    });
    setIsEditing(false);
  };

  if (profileLoading || !profile) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-skate-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}м`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}м`;
  };

  const unlockedRewards = rewards.filter(r => r.isUnlocked);
  const totalRewards = rewards.length;

  const achievements = [
    { name: 'Первые 10 км', icon: Trophy, earned: (stats?.totalDistance || 0) >= 10 },
    { name: 'Скоростной демон', icon: Zap, earned: (stats?.averageSpeed || 0) >= 20 },
    { name: 'Марафонец', icon: MapPin, earned: (stats?.totalDistance || 0) >= 42 },
    { name: 'Активный райдер', icon: Calendar, earned: (stats?.totalRoutes || 0) >= 10 },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-skate-primary to-skate-secondary text-white">
                    {profile.full_name?.[0] || profile.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Camera size={14} />
                </Button>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="float-right">
                      <Edit2 size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать профиль</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Имя пользователя</label>
                        <Input
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="Имя пользователя"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Полное имя</label>
                        <Input
                          value={editForm.fullName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Полное имя"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                          Отмена
                        </Button>
                        <Button type="submit">Сохранить</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <h1 className="text-2xl font-bold mb-2">{profile.full_name || profile.username}</h1>
                <p className="text-gray-600 mb-3">@{profile.username}</p>
                <p className="text-gray-700 mb-4">
                  {profile.bio || 'Люблю кататься на роликах по городу 🛼'}
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.city && <Badge variant="secondary">{profile.city}</Badge>}
                  <Badge variant="secondary">Роллер</Badge>
                  <Badge variant="secondary">Активный</Badge>
                  {(streakData?.currentStreak || 0) > 0 && (
                    <Badge className="bg-orange-100 text-orange-800">
                      🔥 {streakData?.currentStreak} дней
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button>Редактировать профиль</Button>
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                  <Users size={16} />
                  <span>Подписчики скоро</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin size={24} className="text-skate-primary mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Общее расстояние</p>
              <p className="text-lg font-bold">{stats?.totalDistance || 0} км</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock size={24} className="text-skate-secondary mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Время катания</p>
              <p className="text-lg font-bold">{formatTime(stats?.totalTime || 0)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Zap size={24} className="text-skate-accent mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Средняя скорость</p>
              <p className="text-lg font-bold">{stats?.averageSpeed || 0} км/ч</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Flame size={24} className="text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Серия</p>
              <p className="text-lg font-bold">{streakData?.currentStreak || 0} дней</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-skate-primary" />
              <span>Прогресс целей</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Недельная цель (3 поездки)</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(streakData?.weeklyGoalProgress || 0)}%
                  </span>
                </div>
                <Progress value={streakData?.weeklyGoalProgress || 0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Месячная цель (50 км)</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(streakData?.monthlyGoalProgress || 0)}%
                  </span>
                </div>
                <Progress value={streakData?.monthlyGoalProgress || 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-yellow-500" />
              <span>Награды ({unlockedRewards.length}/{totalRewards})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {rewards.slice(0, 6).map((reward) => (
                <div
                  key={reward.id}
                  className={`p-3 rounded-lg text-center ${
                    reward.isUnlocked
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`text-2xl mb-1 ${reward.isUnlocked ? '' : 'grayscale opacity-50'}`}>
                    {reward.icon}
                  </div>
                  <p className={`text-xs font-medium ${
                    reward.isUnlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {reward.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Последние маршруты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routes.slice(0, 5).map((route) => (
                <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{route.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(route.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-skate-primary">{route.distance} км</p>
                    <p className="text-sm text-gray-600">{Math.floor(route.duration / 60)} мин</p>
                  </div>
                </div>
              ))}
              
              {routes.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Пока нет записанных маршрутов
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;