
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

export const useStreaks = () => {
  const { user } = useAuth();

  const { data: streakData } = useQuery({
    queryKey: ['streaks', user?.id],
    queryFn: async (): Promise<StreakData> => {
      if (!user) return {
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoalProgress: 0,
        monthlyGoalProgress: 0
      };

      // Get all user routes
      const { data: routes, error } = await supabase
        .from('routes')
        .select('created_at, distance')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate streaks
      const routeDates = routes.map(r => new Date(r.created_at).toDateString());
      const uniqueDates = [...new Set(routeDates)].sort();
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      // Calculate current streak
      if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
        let checkDate = new Date();
        if (!uniqueDates.includes(today)) {
          checkDate = new Date(Date.now() - 86400000);
        }
        
        while (uniqueDates.includes(checkDate.toDateString())) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 86400000);
        }
      }

      // Calculate longest streak
      for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0 || new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i-1]).getTime() === 86400000) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      // Weekly progress (goal: 3 rides)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const thisWeekRoutes = routes.filter(r => new Date(r.created_at) >= weekStart);
      const weeklyGoalProgress = Math.min((thisWeekRoutes.length / 3) * 100, 100);

      // Monthly progress (goal: 50km)
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const thisMonthRoutes = routes.filter(r => new Date(r.created_at) >= monthStart);
      const monthlyDistance = thisMonthRoutes.reduce((sum, r) => sum + Number(r.distance), 0);
      const monthlyGoalProgress = Math.min((monthlyDistance / 50) * 100, 100);

      return {
        currentStreak,
        longestStreak,
        lastActivityDate: routes[0]?.created_at,
        weeklyGoalProgress,
        monthlyGoalProgress
      };
    },
    enabled: !!user
  });

  return { streakData };
};
