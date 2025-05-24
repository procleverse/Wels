
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MapPin, Clock, Zap } from 'lucide-react';
import { usePosts, useLikePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Feed: React.FC = () => {
  const { posts, isLoading } = usePosts();
  const { mutate: likePost } = useLikePost();
  const { user } = useAuth();
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-skate-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
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
        </div>

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
                  <span className="text-sm text-gray-500">{formatTime(post.created_at)}</span>
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
                      className="flex items-center space-x-1"
                      onClick={() => handleLike(post.id, false)}
                    >
                      <Heart size={16} />
                      <span>{post.likes_count}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span>{post.comments_count}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {posts.length === 0 && (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Пока нет постов</h3>
              <p className="text-gray-600 mb-4">Будьте первым, кто поделится своим маршрутом!</p>
              <Button onClick={() => navigate('/create')}>Создать пост</Button>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
