
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, MapPin, Clock, Zap, Save } from 'lucide-react';
import { useRecording, useCreateRoute } from '@/hooks/useRoutes';
import { useNavigate } from 'react-router-dom';

export const Map: React.FC = () => {
  const {
    isRecording,
    recordingTime,
    currentRoute,
    startRecording,
    stopRecording
  } = useRecording();
  const { mutate: createRoute } = useCreateRoute();
  const navigate = useNavigate();

  const handleToggleRecording = () => {
    if (isRecording) {
      const routeData = stopRecording();
      // Можно сохранить маршрут автоматически или предложить пользователю
    } else {
      startRecording();
    }
  };

  const handleSaveRoute = () => {
    const routeData = stopRecording();
    createRoute({
      title: `Маршрут ${new Date().toLocaleDateString()}`,
      distance: currentRoute.distance,
      duration: currentRoute.duration,
      average_speed: currentRoute.averageSpeed,
      max_speed: currentRoute.maxSpeed
    });
    navigate('/create');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="h-screen-minus-nav relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={64} className="text-skate-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-skate-primary mb-2">Интерактивная карта</h3>
            <p className="text-gray-600">Здесь будет полноценная карта для записи маршрутов</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>{isRecording ? 'Запись маршрута' : 'Готовы к поездке?'}</span>
                {isRecording && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isRecording ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <MapPin size={20} className="text-skate-primary mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Расстояние</p>
                      <p className="font-bold">{currentRoute.distance.toFixed(1)} км</p>
                    </div>
                    <div>
                      <Clock size={20} className="text-skate-secondary mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Время</p>
                      <p className="font-bold">{formatTime(currentRoute.duration)}</p>
                    </div>
                    <div>
                      <Zap size={20} className="text-skate-accent mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Скорость</p>
                      <p className="font-bold">{currentRoute.averageSpeed.toFixed(1)} км/ч</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleToggleRecording}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Square size={16} className="mr-2" />
                      Остановить
                    </Button>
                    <Button 
                      onClick={handleSaveRoute}
                      variant="outline" 
                      className="flex-1"
                    >
                      <Save size={16} className="mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Нажмите кнопку записи, чтобы начать отслеживать ваш маршрут
                  </p>
                  <Button 
                    onClick={handleToggleRecording}
                    className="w-full bg-gradient-to-r from-skate-primary to-skate-secondary text-white py-6 text-lg"
                  >
                    <Play size={24} className="mr-2" />
                    Начать запись
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
