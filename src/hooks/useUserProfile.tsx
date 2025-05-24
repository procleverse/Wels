
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  total_distance?: number;
  total_rides?: number;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!targetUserId
  });

  return { profile, isLoading };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Профиль обновлён",
        description: "Ваш профиль был успешно обновлён",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive"
      });
    }
  });
};

export const useUserStats = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Получаем статистику из маршрутов
      const { data: routes, error } = await supabase
        .from('routes')
        .select('distance, duration, average_speed')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalDistance = routes.reduce((sum, route) => sum + Number(route.distance || 0), 0);
      const totalTime = routes.reduce((sum, route) => sum + Number(route.duration || 0), 0);
      const avgSpeed = routes.length > 0 
        ? routes.reduce((sum, route) => sum + Number(route.average_speed || 0), 0) / routes.length 
        : 0;

      return {
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: Math.round(totalTime / 60), // в минутах
        averageSpeed: Math.round(avgSpeed * 10) / 10,
        totalRoutes: routes.length
      };
    },
    enabled: !!user
  });

  return { stats };
};
