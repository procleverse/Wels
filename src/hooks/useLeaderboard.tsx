import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  total_distance: number;
  total_routes: number;
  average_speed: number;
  rank: number;
}

export const useLeaderboard = (period: 'week' | 'month' | 'all' = 'month') => {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      let dateFilter = '';
      const now = new Date();
      
      if (period === 'week') {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateFilter = `and routes.created_at >= '${weekStart.toISOString()}'`;
      } else if (period === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = `and routes.created_at >= '${monthStart.toISOString()}'`;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          routes (
            distance,
            duration,
            average_speed,
            created_at
          )
        `);

      if (error) throw error;

      // Process data to calculate stats
      const leaderboardData = data
        .map(profile => {
          let routes = profile.routes || [];
          
          // Filter routes by period
          if (period === 'week') {
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            routes = routes.filter(r => new Date(r.created_at) >= weekStart);
          } else if (period === 'month') {
            const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            routes = routes.filter(r => new Date(r.created_at) >= monthStart);
          }

          const totalDistance = routes.reduce((sum, r) => sum + Number(r.distance || 0), 0);
          const totalRoutes = routes.length;
          const avgSpeed = routes.length > 0 
            ? routes.reduce((sum, r) => sum + Number(r.average_speed || 0), 0) / routes.length 
            : 0;

          return {
            user_id: profile.id,
            username: profile.username || 'Аноним',
            full_name: profile.full_name || profile.username || 'Аноним',
            avatar_url: profile.avatar_url,
            total_distance: Math.round(totalDistance * 10) / 10,
            total_routes: totalRoutes,
            average_speed: Math.round(avgSpeed * 10) / 10,
            rank: 0
          };
        })
        .filter(entry => entry.total_distance > 0)
        .sort((a, b) => b.total_distance - a.total_distance)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
        .slice(0, 10);

      return leaderboardData as LeaderboardEntry[];
    }
  });

  return { leaderboard, isLoading };
};