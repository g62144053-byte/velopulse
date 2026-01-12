import { useEffect, useRef, useState } from 'react';

const brandLogos = [
  { name: 'Maruti Suzuki', initial: 'MS' },
  { name: 'Tata Motors', initial: 'TM' },
  { name: 'Hyundai', initial: 'HY' },
  { name: 'Mahindra', initial: 'MH' },
  { name: 'Kia', initial: 'KIA' },
  { name: 'Toyota', initial: 'TY' },
  { name: 'Honda', initial: 'HN' },
];

export const BrandsSection = () => {
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

  return (
    <section ref={sectionRef} className="py-20 bg-obsidian border-y border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-muted-foreground uppercase tracking-widest text-sm">
            Trusted Brands We Represent
          </p>
        </div>

        {/* Brand Logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brandLogos.map((brand, index) => (
            <div
              key={brand.name}
              className={`group relative transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-card border border-border flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:shadow-glow cursor-pointer">
                <span className="font-display text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  {brand.initial}
                </span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
