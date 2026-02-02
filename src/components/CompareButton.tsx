import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/CompareContext';
import { Car } from '@/data/cars';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  car: Car;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export const CompareButton = ({ car, size = 'icon', variant = 'ghost', className }: CompareButtonProps) => {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const inCompare = isInCompare(car.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(car.id);
    } else {
      addToCompare(car);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-colors',
        inCompare && 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
    >
      <Scale className="w-4 h-4" />
    </Button>
  );
};
