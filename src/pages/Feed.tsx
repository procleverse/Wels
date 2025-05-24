
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MapPin, 
  Clock, 
  Zap, 
  Trophy, 
  Flame,
  MoreVertical,
  Trash2
} from 'lucide-react';
import { usePosts, useLikePost, useDeletePost, useSharePost } from '@/hooks/usePosts';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useStreaks } from '@/hooks/useStreaks';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Feed: React.FC = () => {
  const { posts, isLoading } = usePosts();
  const { mutate: likePost } = useLikePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: sharePost } = useSharePost();
  const { leaderboard } = useLeaderboard('week');
  const { streakData } = useStreaks();
  const { rewards } = useRewards();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');

  const handleLike = (postId: string, isLiked: boolean) => {
    likePost({ postId, isLiked });
  };

  const formatTime = (createdAt: string) => {
    const now = new Date();
    const postTime = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'только что';
    if (diffInHours < 24) return `${diffInHours} ч назад`;
    return `${Math.floor(diffInHours / 24)} дн назад`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}м`;
  };

  const getRewardColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'diamond': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed">Лента</TabsTrigger>
            <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
            <TabsTrigger value="rewards">Награды</TabsTrigger>
            <TabsTrigger value="challenges">Вызовы</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Streak Card */}
            {streakData && (
              <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Flame size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Серия: {streakData.currentStreak} дней</h3>
                        <p className="text-white/90">Рекорд: {streakData.longestStreak} дней</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/90">Недельная цель</p>
                      <div className="w-32 bg-white/20 rounded-full h-2 mt-1">
                        <div 
                          className="bg-white h-2 rounded-full transition-all"
                          style={{ width: `${streakData.weeklyGoalProgress}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1">{Math.round(streakData.weeklyGoalProgress)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Card */}
            <Card className="bg-gradient-to-r from-skate-primary to-skate-secondary text-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">Готовы к новому маршруту?</h2>
                <p className="mb-4">Запишите свою следующую прокатку и поделитесь с сообществом</p>
                <Button 
                  className="bg-white text-skate-primary hover:bg-gray-100"
                  onClick={() => navigate('/map')}
                >
                  Начать запись
                </Button>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.profiles?.avatar_url} />
                          <AvatarFallback>
                            {post.profiles?.full_name?.[0] || post.profiles?.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{post.profiles?.full_name || post.profiles?.username}</p>
                          <p className="text-sm text-gray-500">@{post.profiles?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{formatTime(post.created_at)}</span>
                        {user?.id === post.user_id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => deletePost(post.id)}
                                className="text-red-600"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="mb-4">{post.content}</p>
                    
                    {post.routes && (
                      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <MapPin size={16} className="text-skate-primary" />
                              <span className="text-sm font-medium">{post.routes.distance} км</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={16} className="text-skate-secondary" />
                              <span className="text-sm font-medium">{formatDuration(post.routes.duration)}</span>
                            </div>
                            {post.routes.average_speed && (
                              <div className="flex items-center space-x-1">
                                <Zap size={16} className="text-skate-accent" />
                                <span className="text-sm font-medium">{post.routes.average_speed.toFixed(1)} км/ч</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex items-center space-x-1 ${post.user_liked ? 'text-red-500' : ''}`}
                          onClick={() => handleLike(post.id, post.user_liked || false)}
                        >
                          <Heart size={16} fill={post.user_liked ? 'currentColor' : 'none'} />
                          <span>{post.likes_count}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>{post.comments_count}</span>
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => sharePost(post.id)}
                      >
                        <Share size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-500" />
                  <h2 className="text-xl font-bold">Рейтинг недели</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <div key={entry.user_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                        }`}>
                          {entry.rank}
                        </div>
                        <Avatar>
                          <AvatarImage src={entry.avatar_url} />
                          <AvatarFallback>{entry.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{entry.full_name}</p>
                          <p className="text-sm text-gray-500">@{entry.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-skate-primary">{entry.total_distance} км</p>
                        <p className="text-sm text-gray-500">{entry.total_routes} поездок</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trophy className="text-yellow-500" />
                  <h2 className="text-xl font-bold">Награды и достижения</h2>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className={`p-4 rounded-lg border ${
                        reward.isUnlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{reward.icon}</span>
                          <div>
                            <h3 className="font-semibold">{reward.title}</h3>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                          </div>
                        </div>
                        <Badge className={getRewardColor(reward.rarity)}>
                          {reward.rarity}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            reward.isUnlocked ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min((reward.currentProgress / reward.requirement) * 100, 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {reward.currentProgress} / {reward.requirement}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">Недельные вызовы</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Скоростной вызов</h3>
                        <p className="text-sm text-gray-600">Достигните средней скорости 25 км/ч</p>
                      </div>
                      <Badge variant="outline">50 XP</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Исследователь</h3>
                        <p className="text-sm text-gray-600">Посетите 3 новых места за неделю</p>
                      </div>
                      <Badge variant="outline">75 XP</Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Социальная активность</h3>
                        <p className="text-sm text-gray-600">Поставьте 10 лайков другим роллерам</p>
                      </div>
                      <Badge variant="outline">30 XP</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Feed;
