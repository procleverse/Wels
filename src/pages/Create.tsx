
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, MapPin, Clock, Zap, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Create: React.FC = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    toast({
      title: "Пост опубликован!",
      description: "Ваш маршрут был успешно добавлен в ленту",
    });
    setContent('');
    setTags([]);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-skate-primary mb-6">Создать пост</h1>

        <div className="space-y-6">
          {/* Основная карточка создания */}
          <Card>
            <CardHeader>
              <CardTitle>Поделитесь своим маршрутом</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Расскажите о своей поездке..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />

              {/* Добавление фото */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-skate-primary transition-colors cursor-pointer">
                <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Добавить фотографии</p>
                <p className="text-sm text-gray-500">Нажмите или перетащите файлы</p>
              </div>

              {/* Теги */}
              <div>
                <label className="text-sm font-medium mb-2 block">Теги</label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    placeholder="Добавить тег..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} size="sm">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <X
                        size={12}
                        className="cursor-pointer hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Статистика маршрута */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика маршрута</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <MapPin size={24} className="text-skate-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Расстояние</p>
                  <p className="text-xl font-bold">12.5 км</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock size={24} className="text-skate-secondary mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Время</p>
                  <p className="text-xl font-bold">45 мин</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Zap size={24} className="text-skate-accent mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Ср. скорость</p>
                  <p className="text-xl font-bold">16.7 км/ч</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки действий */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-skate-primary to-skate-secondary text-white"
              disabled={!content.trim()}
            >
              Опубликовать
            </Button>
            <Button variant="outline" className="flex-1">
              Сохранить черновик
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
