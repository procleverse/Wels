import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  user_id: string;
  route_id?: string;
  images?: string[];
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
  routes?: {
    distance: number;
    duration: number;
    average_speed?: number;
  };
  user_liked?: boolean;
}

export const usePosts = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, full_name, avatar_url),
          routes (distance, duration, average_speed)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check if current user liked each post
      const postsWithLikes = await Promise.all(
        data.map(async (post) => {
          if (!user) return { ...post, user_liked: false };
          
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .single();
            
          return { ...post, user_liked: !!likeData };
        })
      );

      return postsWithLikes as Post[];
    },
    enabled: true
  });

  return { posts, isLoading, error };
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ content, routeId }: { content: string; routeId?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          content,
          user_id: user.id,
          route_id: routeId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Пост создан!",
        description: "Ваш пост был успешно опубликован",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать пост",
        variant: "destructive"
      });
    }
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить лайк",
        variant: "destructive"
      });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Пост удален",
        description: "Ваш пост был успешно удален",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пост",
        variant: "destructive"
      });
    }
  });
};

export const useSharePost = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (navigator.share) {
        await navigator.share({
          title: 'RollerSocial - Пост',
          text: 'Посмотри этот крутой пост!',
          url: `${window.location.origin}/post/${postId}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
        throw new Error('Link copied to clipboard');
      }
    },
    onSuccess: () => {
      toast({
        title: "Поделились!",
        description: "Пост был успешно отправлен",
      });
    },
    onError: (error) => {
      if (error.message === 'Link copied to clipboard') {
        toast({
          title: "Ссылка скопирована",
          description: "Ссылка на пост скопирована в буфер обмена",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось поделиться постом",
          variant: "destructive"
        });
      }
    }
  });
};