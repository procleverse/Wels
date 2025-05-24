
import { useQuery } from '@tanstack/react-query';
import { useUserStats } from '@/hooks/useUserProfile';
import { useStreaks } from '@/hooks/useStreaks';

export interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'distance' | 'speed' | 'streak' | 'social' | 'special';
  requirement: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'diamond';
}

export const useRewards = () => {
  const { stats } = useUserStats();
  const { streakData } = useStreaks();

  const { data: rewards = [] } = useQuery({
    queryKey: ['rewards', stats, streakData],
    queryFn: async (): Promise<Reward[]> => {
      const rewardDefinitions: Omit<Reward, 'currentProgress' | 'isUnlocked' | 'unlockedAt'>[] = [
        // Distance rewards
        { id: 'first_km', title: 'Первый километр', description: 'Проехать первый километр', icon: '🛼', category: 'distance', requirement: 1, rarity: 'bronze' },
        { id: 'explorer', title: 'Исследователь', description: 'Проехать 10 км', icon: '🗺️', category: 'distance', requirement: 10, rarity: 'silver' },
        { id: 'adventurer', title: 'Авантюрист', description: 'Проехать 50 км', icon: '🏔️', category: 'distance', requirement: 50, rarity: 'gold' },
        { id: 'marathon', title: 'Марафонец', description: 'Проехать 100 км', icon: '🏆', category: 'distance', requirement: 100, rarity: 'diamond' },
        
        // Speed rewards
        { id: 'speed_demon', title: 'Скоростной демон', description: 'Средняя скорость 20 км/ч', icon: '⚡', category: 'speed', requirement: 20, rarity: 'silver' },
        { id: 'lightning', title: 'Молния', description: 'Средняя скорость 30 км/ч', icon: '🌩️', category: 'speed', requirement: 30, rarity: 'gold' },
        
        // Streak rewards
        { id: 'consistent', title: 'Постоянство', description: 'Серия в 3 дня', icon: '🔥', category: 'streak', requirement: 3, rarity: 'bronze' },
        { id: 'dedicated', title: 'Преданность', description: 'Серия в 7 дней', icon: '💪', category: 'streak', requirement: 7, rarity: 'silver' },
        { id: 'unstoppable', title: 'Неудержимый', description: 'Серия в 30 дней', icon: '👑', category: 'streak', requirement: 30, rarity: 'diamond' },
        
        // Social rewards
        { id: 'social_starter', title: 'Социальный старт', description: 'Создать первый пост', icon: '📝', category: 'social', requirement: 1, rarity: 'bronze' },
        { id: 'popular', title: 'Популярный', description: 'Получить 10 лайков', icon: '❤️', category: 'social', requirement: 10, rarity: 'silver' },
        
        // Special rewards
        { id: 'early_bird', title: 'Ранняя пташка', description: 'Покататься до 7 утра', icon: '🌅', category: 'special', requirement: 1, rarity: 'gold' },
        { id: 'night_rider', title: 'Ночной гонщик', description: 'Покататься после 22:00', icon: '🌙', category: 'special', requirement: 1, rarity: 'gold' },
      ];

      return rewardDefinitions.map(reward => {
        let currentProgress = 0;
        let isUnlocked = false;

        switch (reward.category) {
          case 'distance':
            currentProgress = stats?.totalDistance || 0;
            break;
          case 'speed':
            currentProgress = stats?.averageSpeed || 0;
            break;
          case 'streak':
            currentProgress = streakData?.currentStreak || 0;
            break;
          case 'social':
            currentProgress = 0; // This would need post/like data
            break;
          case 'special':
            currentProgress = 0; // This would need time-based route data
            break;
        }

        isUnlocked = currentProgress >= reward.requirement;

        return {
          ...reward,
          currentProgress,
          isUnlocked,
          unlockedAt: isUnlocked ? new Date().toISOString() : undefined
        };
      });
    },
    enabled: !!stats || !!streakData
  });

  return { rewards };
};
