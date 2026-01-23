import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, BadgeIndianRupee, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Wrench,
      title: 'Service & Maintenance',
      description:
        'Genuine parts, certified technicians, and transparent service estimates—so your car feels showroom-fresh for years.',
      bullets: ['Periodic maintenance', 'Diagnostics & repairs', 'Detailing & protection'],
    },
    {
      icon: BadgeIndianRupee,
      title: 'Finance & Insurance',
      description:
        'Competitive offers tailored to your budget—fast approvals, clear paperwork, and coverage that actually fits your needs.',
      bullets: ['Loan assistance', 'Insurance renewal', 'Documentation support'],
    },
    {
      icon: ShieldCheck,
      title: 'Car Trade‑In',
      description:
        'Upgrade with confidence. Get a fair valuation, quick inspection, and a smooth exchange experience—end to end.',
      bullets: ['Instant valuation', 'Inspection support', 'Exchange assistance'],
    },
  ];

  const steps = [
    {
      title: 'Tell us what you need',
      description: 'Share your requirement in a quick message—service, finance, insurance, or trade‑in.',
    },
    {
      title: 'We respond with options',
      description: 'You’ll get clear next steps, timelines, and cost estimates (where applicable).',
    },
    {
      title: 'Handover made simple',
      description: 'Book your visit and we’ll take care of the rest with premium, showroom‑grade support.',
    },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section ref={headerRef} className="py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div
            className={`max-w-3xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">Support that matches the car</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Services
              <span className="text-gradient-gold block">Built for Indian Roads</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From maintenance and finance to trade‑ins—Auto Pulse delivers a premium, transparent ownership experience.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  Contact us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/cars">Browse cars</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">What we offer</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Premium dealership services</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="p-8 bg-gradient-card rounded-2xl border border-border transition-all duration-700 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{s.description}</p>
                <ul className="space-y-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-obsidian">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">A smooth, guided process</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={step.title} className="p-8 bg-gradient-card rounded-2xl border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-primary">{idx + 1}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                </div>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-card rounded-3xl border border-border p-10 md:p-14 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready for premium support?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tell us what you need—our team will respond with the best next step.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact" className="inline-flex items-center gap-2">
                Contact us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
