import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  carId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export const FavoriteButton = ({ carId, variant = 'icon', className }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(carId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(carId);
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isFav ? 'default' : 'outline'}
        onClick={handleClick}
        className={cn(
          'flex items-center gap-2',
          isFav && 'bg-primary text-primary-foreground',
          className
        )}
      >
        <Heart className={cn('w-4 h-4', isFav && 'fill-current')} />
        {isFav ? 'In Wishlist' : 'Add to Wishlist'}
      </Button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
        isFav
          ? 'bg-primary text-primary-foreground shadow-lg'
          : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:bg-primary/20 hover:text-primary',
        className
      )}
      aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('w-5 h-5', isFav && 'fill-current')} />
    </button>
  );
};
