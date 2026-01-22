import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch favorites from database
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id')
        .eq('user_id', user.id);

      if (error) throw error;

      setFavorites(data?.map((f) => f.car_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (carId: string) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to add cars to your wishlist.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: carId });

      if (error) throw error;

      setFavorites((prev) => [...prev, carId]);
      toast({
        title: 'Added to Wishlist',
        description: 'Car has been added to your wishlist.',
      });
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        // Duplicate entry - already in favorites
        toast({
          title: 'Already in Wishlist',
          description: 'This car is already in your wishlist.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add car to wishlist.',
          variant: 'destructive',
        });
      }
      return false;
    }
  }, [user, toast]);

  const removeFavorite = useCallback(async (carId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((id) => id !== carId));
      toast({
        title: 'Removed from Wishlist',
        description: 'Car has been removed from your wishlist.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove car from wishlist.',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, toast]);

  const toggleFavorite = useCallback(async (carId: string) => {
    if (favorites.includes(carId)) {
      return removeFavorite(carId);
    } else {
      return addFavorite(carId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((carId: string) => {
    return favorites.includes(carId);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
};
