import { useRef, useEffect, useState } from 'react';
import { Clock, X } from 'lucide-react';
import { CarCard } from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { cars } from '@/data/cars';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface RecentlyViewedCarsProps {
  currentCarId?: string;
}

export const RecentlyViewedCars = ({ currentCarId }: RecentlyViewedCarsProps) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filter out the current car if on a car details page
  const viewedCarIds = currentCarId 
    ? recentlyViewed.filter((id) => id !== currentCarId) 
    : recentlyViewed;

  const viewedCars = viewedCarIds
    .map((id) => cars.find((car) => car.id === id))
    .filter(Boolean);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (viewedCars.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Recently Viewed
                </h2>
                <p className="text-muted-foreground text-sm">
                  Cars you've looked at
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {viewedCars.map((car, index) => (
              <div
                key={car!.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CarCard car={car!} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
