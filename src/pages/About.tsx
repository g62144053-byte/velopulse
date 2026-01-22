import { useEffect, useRef, useState } from 'react';
import { Shield, Award, Users, Heart, Target, Lightbulb } from 'lucide-react';

const About = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  const observeSection = (id: string) => {
    return (ref: HTMLElement | null) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(id));
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(ref);
    };
  };

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We believe in honest dealings and transparent pricing with no hidden costs.',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Every vehicle goes through rigorous quality checks before reaching you.',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go the extra mile to serve you better.',
    },
    {
      icon: Heart,
      title: 'Passion for Cars',
      description: 'Our team shares a genuine love for automobiles and the joy of driving.',
    },
  ];

  const milestones = [
    { year: '2009', title: 'Founded', description: 'Started with a single showroom in Mumbai' },
    { year: '2012', title: '1000+ Sales', description: 'Reached our first major sales milestone' },
    { year: '2015', title: 'Expansion', description: 'Opened showrooms across Maharashtra' },
    { year: '2018', title: 'Digital Launch', description: 'Launched online booking platform' },
    { year: '2021', title: 'EV Ready', description: 'Added electric vehicles to our lineup' },
    { year: '2024', title: 'Pan India', description: 'Now serving customers across India' },
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section
        ref={observeSection('hero')}
        className="py-24 bg-gradient-hero relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`max-w-3xl transition-all duration-700 ${visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              About Us
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Driving Dreams
              <span className="text-gradient-gold block">Since 2009</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Auto Pulse is India's trusted car dealership, dedicated to connecting you with the perfect vehicle. With a legacy of excellence and a passion for automobiles, we've helped over 5,000 customers find their dream cars.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={observeSection('story')} className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-700 ${visibleSections.has('story') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  What started as a small showroom in Mumbai has grown into one of India's most trusted car dealership networks. Our founder, driven by a passion for automobiles and a commitment to customer service, envisioned a dealership that would redefine the car-buying experience.
                </p>
                <p>
                  Today, Auto Pulse represents the finest Indian automobile brands, from Maruti Suzuki to Tata Motors, Hyundai to Mahindra. We pride ourselves on offering not just cars, but complete mobility solutions with transparent pricing and exceptional after-sales service.
                </p>
                <p>
                  Our team of automotive experts understands that buying a car is more than a transaction—it's the beginning of countless journeys, family memories, and personal achievements. That's why we're committed to making every customer's experience memorable.
                </p>
              </div>
            </div>

            <div className={`relative transition-all duration-700 delay-200 ${visibleSections.has('story') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="aspect-square rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80"
                  alt="Car showroom"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary rounded-2xl p-6 shadow-button">
                <p className="text-4xl font-bold text-primary-foreground font-display">15+</p>
                <p className="text-primary-foreground/80 text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={observeSection('values')} className="py-24 bg-obsidian">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              What We Stand For
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`p-6 bg-gradient-card rounded-2xl border border-border transition-all duration-700 ${
                  visibleSections.has('values') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={observeSection('timeline')} className="py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Our Journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } transition-all duration-700 ${
                    visibleSections.has('timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-gradient-card rounded-xl p-6 border border-border inline-block">
                      <p className="text-primary font-bold text-xl mb-1">{milestone.year}</p>
                      <h3 className="font-semibold text-foreground mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground text-sm">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="w-4 h-4 rounded-full bg-primary relative z-10 ring-4 ring-background" />

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section ref={observeSection('vision')} className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 bg-gradient-card rounded-2xl border border-border transition-all duration-700 ${visibleSections.has('vision') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To make car ownership accessible, transparent, and joyful for every Indian. We strive to provide the best selection of vehicles, competitive pricing, and exceptional customer service that exceeds expectations.
              </p>
            </div>

            <div className={`p-8 bg-gradient-card rounded-2xl border border-border transition-all duration-700 delay-200 ${visibleSections.has('vision') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To be India's most trusted automotive partner, leading the transition to sustainable mobility while preserving the thrill of driving. We envision a future where every journey is powered by innovation and care.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
