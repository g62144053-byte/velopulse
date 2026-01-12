import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Shield, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = heroRef.current.getBoundingClientRect();
      const x = (clientX - left) / width - 0.5;
      const y = (clientY - top) / height - 0.5;

      heroRef.current.style.setProperty('--mouse-x', `${x * 20}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y * 20}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
      style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Hero Image */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full hidden lg:block"
        style={{
          transform: `translate(var(--mouse-x), var(--mouse-y)) translateY(-50%)`
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80"
          alt="Premium Car"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">India's Premier Car Dealership</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Drive Your
            <span className="block text-gradient-gold">Dream Car</span>
            Today
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Experience the finest collection of Indian automobiles. From iconic SUVs to efficient hatchbacks, find your perfect ride at Velocity Motors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/cars" className="flex items-center gap-2">
                Explore Cars
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Book Test Drive
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: Shield, label: 'Certified Dealers', value: '100%' },
              { icon: Award, label: 'Cars Sold', value: '5000+' },
              { icon: Clock, label: 'Years Experience', value: '15+' },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <badge.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{badge.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{badge.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};
