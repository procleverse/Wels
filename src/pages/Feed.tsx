
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MapPin, Clock, Zap } from 'lucide-react';

export const Feed: React.FC = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: 'Анна Катается',
        avatar: '',
        username: '@anna_skates'
      },
      content: 'Отличная вечерняя прокатка по набережной! 🛼',
      route: {
        distance: '12.5 км',
        duration: '45 мин',
        speed: '16.7 км/ч'
      },
      likes: 24,
      comments: 5,
      time: '2 часа назад'
    },
    {
      id: 2,
      user: {
        name: 'Максим Роллер',
        avatar: '',
        username: '@max_roller'
      },
      content: 'Новый рекорд по скорости! Кто готов побить? 💨',
      route: {
        distance: '8.2 км',
        duration: '22 мин',
        speed: '22.4 км/ч'
      },
      likes: 42,
      comments: 12,
      time: '4 часа назад'
    }
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-skate-primary to-skate-secondary text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Готовы к новому маршруту?</h2>
              <p className="mb-4">Запишите свою следующую прокатку и поделитесь с сообществом</p>
              <Button className="bg-white text-skate-primary hover:bg-gray-100">
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
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.user.name}</p>
                      <p className="text-sm text-gray-500">{post.user.username}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{post.time}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="mb-4">{post.content}</p>
                
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} className="text-skate-primary" />
                        <span className="text-sm font-medium">{post.route.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} className="text-skate-secondary" />
                        <span className="text-sm font-medium">{post.route.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap size={16} className="text-skate-accent" />
                        <span className="text-sm font-medium">{post.route.speed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Heart size={16} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageCircle size={16} />
                      <span>{post.comments}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;
