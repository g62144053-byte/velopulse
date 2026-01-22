import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { CarCard } from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { cars } from '@/data/cars';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';

const Wishlist = () => {
  const { favorites, isLoading } = useFavorites();
  const { user } = useAuth();
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const favoriteCars = favorites
    .map((id) => cars.find((car) => car.id === id))
    .filter(Boolean);

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Login to View Wishlist
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to save your favorite cars and access them anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="heroOutline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-gradient-hero py-16 border-b border-border"
      >
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-700 ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-2">
              Your Favorites
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              My
              <span className="text-gradient-gold ml-3">Wishlist</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {favoriteCars.length > 0
                ? `You have ${favoriteCars.length} car${favoriteCars.length > 1 ? 's' : ''} in your wishlist.`
                : 'Save cars you love to compare and review later.'}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : favoriteCars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteCars.map((car, index) => (
              <div
                key={car!.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CarCard car={car!} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start browsing our collection and click the heart icon on cars you love to add them here.
            </p>
            <Button variant="hero" asChild>
              <Link to="/cars" className="flex items-center gap-2">
                Browse Cars
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
