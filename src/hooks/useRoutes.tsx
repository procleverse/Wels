
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Route {
  id: string;
  title: string;
  description?: string;
  distance: number;
  duration: number;
  average_speed?: number;
  max_speed?: number;
  elevation_gain?: number;
  route_data?: any;
  created_at: string;
  user_id: string;
}

export const useRoutes = () => {
  const { user } = useAuth();

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['routes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Route[];
    },
    enabled: !!user
  });

  return { routes, isLoading };
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (routeData: {
      title: string;
      description?: string;
      distance: number;
      duration: number;
      average_speed?: number;
      max_speed?: number;
      elevation_gain?: number;
      route_data?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('routes')
        .insert({
          ...routeData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast({
        title: "Маршрут сохранён!",
        description: "Ваш маршрут был успешно сохранён",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить маршрут",
        variant: "destructive"
      });
    }
  });
};

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentRoute, setCurrentRoute] = useState({
    distance: 0,
    duration: 0,
    averageSpeed: 0,
    maxSpeed: 0
  });

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setCurrentRoute({
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0
    });

    // Симуляция записи маршрута
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
      setCurrentRoute(prev => ({
        distance: prev.distance + 0.1,
        duration: prev.duration + 1,
        averageSpeed: (prev.distance + 0.1) / ((prev.duration + 1) / 3600),
        maxSpeed: Math.max(prev.maxSpeed, Math.random() * 30)
      }));
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopRecording = () => {
    setIsRecording(false);
    return currentRoute;
  };

  return {
    isRecording,
    recordingTime,
    currentRoute,
    startRecording,
    stopRecording
  };
};
