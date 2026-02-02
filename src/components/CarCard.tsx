import { Link } from 'react-router-dom';
import { Fuel, Settings, Users, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Car, formatPrice } from '@/data/cars';
import { cn } from '@/lib/utils';
import { BuyCarDialog } from '@/components/BuyCarDialog';
import { FavoriteButton } from '@/components/FavoriteButton';
import { CompareButton } from '@/components/CompareButton';

interface CarCardProps {
  car: Car;
  className?: string;
}

export const CarCard = ({ car, className }: CarCardProps) => {
  return (
    <div
      className={cn(
        'group relative bg-gradient-card rounded-2xl overflow-hidden border border-border card-3d',
        className
      )}
    >
      {/* Featured Badge */}
      {car.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-gradient-gold text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-1">
        <CompareButton car={car} className="bg-background/80 backdrop-blur-sm" />
        <FavoriteButton carId={car.id} />
      </div>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Brand & Model */}
        <div>
          <p className="text-xs text-primary font-semibold uppercase tracking-wider">
            {car.brand}
          </p>
          <h3 className="font-display text-xl font-bold text-foreground mt-1">
            {car.model}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-xs">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-xs">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-4 h-4 text-primary" />
            <span className="text-xs">{car.mileage}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs">{car.seating} Seats</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Starting from</p>
            <p className="text-lg font-bold text-gradient-gold font-sans">
              {formatPrice(car.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BuyCarDialog 
              carId={car.id} 
              carName={`${car.brand} ${car.model}`} 
              carPrice={formatPrice(car.price)} 
            />
            <Button variant="hero" size="sm" asChild>
              <Link to={`/cars/${car.id}`}>View</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl shadow-card-hover" />
      </div>
    </div>
  );
};
