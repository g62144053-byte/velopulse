import { Link } from 'react-router-dom';
import { X, Scale, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/contexts/CompareContext';
import { formatPrice } from '@/data/cars';
import { cn } from '@/lib/utils';

export const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-lg animate-in slide-in-from-bottom-4">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Car thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="w-5 h-5" />
              <span className="font-semibold text-sm whitespace-nowrap">Compare ({compareList.length}/3)</span>
            </div>
            <div className="flex gap-2">
              {compareList.map((car) => (
                <div
                  key={car.id}
                  className="relative flex items-center gap-2 bg-muted rounded-lg px-3 py-2 group"
                >
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium text-foreground truncate max-w-[100px]">
                      {car.brand} {car.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatPrice(car.price)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCompare(car.id)}
                    className={cn(
                      'absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground',
                      'flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                    )}
                    aria-label={`Remove ${car.brand} ${car.model} from compare`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear all
            </Button>
            <Button variant="hero" size="sm" asChild disabled={compareList.length < 2}>
              <Link to="/compare" className="flex items-center gap-1">
                Compare
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
