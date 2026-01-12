import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Calendar, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Car,
      title: 'Premium Selection',
      description: 'Handpicked Indian automobiles from trusted manufacturers',
    },
    {
      icon: Calendar,
      title: 'Easy Test Drives',
      description: 'Book a test drive at your convenience, any time',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated support team to assist you always',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Your Journey to the
              <span className="text-gradient-gold block">Perfect Car Starts Here</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              With over 15 years of experience, Velocity Motors has helped thousands of customers find their ideal vehicle. We pride ourselves on transparency, quality, and exceptional service.
            </p>

            <div className="space-y-6 mb-10">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" asChild>
              <Link to="/contact" className="flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Right: Stats Card */}
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-gradient-card rounded-3xl p-8 md:p-12 border border-border relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  {[
                    { value: '5000+', label: 'Cars Sold' },
                    { value: '50+', label: 'Showrooms' },
                    { value: '15+', label: 'Years Experience' },
                    { value: '99%', label: 'Happy Customers' },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`text-center transition-all duration-500 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                      style={{ transitionDelay: `${(index + 4) * 100}ms` }}
                    >
                      <p className="text-4xl md:text-5xl font-bold text-gradient-gold font-display mb-2">
                        {stat.value}
                      </p>
                      <p className="text-muted-foreground text-sm uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Decorative Lines */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-border" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-border" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 px-6 py-4 bg-primary rounded-2xl shadow-button animate-float">
                <p className="text-primary-foreground font-bold text-lg">Trusted Since 2009</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
