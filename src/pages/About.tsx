import { useState } from 'react';
import { Shield, Award, Users, Heart, Target, Lightbulb, MapPin, Phone, Clock, Car, Wrench, BadgeCheck, TrendingUp, Building2, Handshake, Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    { year: '2009', title: 'Founded', description: 'Started with a single showroom in Mumbai with just 5 employees' },
    { year: '2012', title: '1000+ Sales', description: 'Reached our first major sales milestone and expanded team to 25' },
    { year: '2015', title: 'Expansion', description: 'Opened showrooms across Maharashtra in Pune, Nagpur & Nashik' },
    { year: '2018', title: 'Digital Launch', description: 'Launched online booking platform serving 10,000+ customers annually' },
    { year: '2021', title: 'EV Ready', description: 'Added electric vehicles and hybrid cars to our lineup' },
    { year: '2024', title: 'Pan India', description: 'Now serving customers across 15+ cities with 200+ employees' },
  ];

  const stats = [
    { icon: Car, value: '5,000+', label: 'Vehicles Sold' },
    { icon: Users, value: '50,000+', label: 'Happy Customers' },
    { icon: Building2, value: '15+', label: 'Showrooms' },
    { icon: Wrench, value: '10+', label: 'Service Centers' },
  ];

  const teamMembers = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: '20+ years in automotive industry',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face',
      bio: 'Expert in customer relations',
    },
    {
      name: 'Amit Patel',
      role: 'Service Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Certified automotive engineer',
    },
    {
      name: 'Sneha Reddy',
      role: 'Finance Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Simplified loan processing expert',
    },
  ];

  const services = [
    {
      icon: Car,
      title: 'New Car Sales',
      description: 'Wide range of latest models from top Indian brands with best-in-class pricing.',
    },
    {
      icon: BadgeCheck,
      title: 'Certified Pre-Owned',
      description: 'Thoroughly inspected used cars with warranty and complete documentation.',
    },
    {
      icon: Wrench,
      title: 'Service & Maintenance',
      description: 'State-of-the-art service centers with genuine parts and trained technicians.',
    },
    {
      icon: TrendingUp,
      title: 'Easy Financing',
      description: 'Hassle-free loan options with competitive interest rates from leading banks.',
    },
    {
      icon: Handshake,
      title: 'Trade-In Program',
      description: 'Get the best value for your old car when you upgrade to a new one.',
    },
    {
      icon: Shield,
      title: 'Extended Warranty',
      description: 'Additional protection plans to keep your vehicle covered beyond manufacturer warranty.',
    },
  ];

  const locations = [
    { city: 'Mumbai', address: 'Andheri West, Near Metro Station', phone: '+91 22 1234 5678' },
    { city: 'Pune', address: 'Koregaon Park, Main Road', phone: '+91 20 2345 6789' },
    { city: 'Delhi NCR', address: 'Gurugram, Sector 29', phone: '+91 124 345 6789' },
    { city: 'Bangalore', address: 'Whitefield, Main Road', phone: '+91 80 4567 8901' },
  ];

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1562141961-b5d1bf4c0728?w=800&q=80',
      alt: 'Modern car showroom interior',
      category: 'Showroom',
    },
    {
      src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      alt: 'Luxury sports car display',
      category: 'Collection',
    },
    {
      src: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800&q=80',
      alt: 'Premium car lineup',
      category: 'Collection',
    },
    {
      src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80',
      alt: 'SUV collection showcase',
      category: 'Collection',
    },
    {
      src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
      alt: 'Elegant sedan display',
      category: 'Collection',
    },
    {
      src: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
      alt: 'State-of-the-art service center',
      category: 'Service Center',
    },
    {
      src: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80',
      alt: 'Premium sports car',
      category: 'Collection',
    },
    {
      src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
      alt: 'Customer delivery ceremony',
      category: 'Showroom',
    },
  ];

  const testimonials = [
    {
      name: 'Vikram Mehta',
      location: 'Mumbai',
      car: 'Tata Nexon EV',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      review: 'Exceptional experience at Auto Pulse! The team helped me transition to electric seamlessly. From test drive to delivery, everything was handled professionally. Highly recommend for EV buyers!',
    },
    {
      name: 'Ananya Sharma',
      location: 'Delhi',
      car: 'Hyundai Creta',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      review: 'As a first-time car buyer, I was nervous about the process. The Auto Pulse team made it so easy! They explained every feature and helped me get the best financing option. Love my new Creta!',
    },
    {
      name: 'Rajendra Patil',
      location: 'Pune',
      car: 'Mahindra XUV700',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      review: 'The trade-in value I got for my old car was fantastic. The entire process was transparent with no hidden charges. Auto Pulse truly lives up to its reputation for honest dealings.',
    },
    {
      name: 'Priyanka Reddy',
      location: 'Bangalore',
      car: 'Maruti Suzuki Grand Vitara',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      review: 'Outstanding service center! My car servicing is always done on time with genuine parts. The staff is knowledgeable and keeps me informed about everything. Best dealership experience ever!',
    },
    {
      name: 'Arjun Nair',
      location: 'Mumbai',
      car: 'Kia Seltos',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
      review: 'What sets Auto Pulse apart is their after-sales service. Even months after purchase, they follow up and ensure everything is perfect. This level of care is rare to find!',
    },
    {
      name: 'Meera Krishnan',
      location: 'Chennai',
      car: 'Toyota Fortuner',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=150&h=150&fit=crop&crop=face',
      review: 'Bought my dream Fortuner from Auto Pulse. The team went above and beyond to get me the exact variant and color I wanted. Delivery was a celebration! Thank you, Auto Pulse!',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
              Auto Pulse is India's trusted car dealership, dedicated to connecting you with the perfect vehicle. With a legacy of excellence and a passion for automobiles, we've helped over 50,000 customers find their dream cars across 15+ cities.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={observeSection('stats')} className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-10 h-10 text-primary-foreground mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">{stat.value}</p>
                <p className="text-primary-foreground/80 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
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
                  What started as a small showroom in Mumbai has grown into one of India's most trusted car dealership networks. Our founder, Rajesh Kumar, driven by a passion for automobiles and a commitment to customer service, envisioned a dealership that would redefine the car-buying experience.
                </p>
                <p>
                  Today, Auto Pulse represents the finest Indian automobile brands, from Maruti Suzuki to Tata Motors, Hyundai to Mahindra. We pride ourselves on offering not just cars, but complete mobility solutions with transparent pricing and exceptional after-sales service.
                </p>
                <p>
                  Our team of 200+ automotive experts understands that buying a car is more than a transaction—it's the beginning of countless journeys, family memories, and personal achievements. That's why we're committed to making every customer's experience memorable.
                </p>
                <p>
                  From first-time buyers looking for budget-friendly hatchbacks to business owners seeking premium SUVs, we cater to every need with personalized attention and expert guidance. Our financing partners ensure you get the best loan options, while our service centers keep your vehicle running smoothly for years.
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

      {/* Services Section */}
      <section ref={observeSection('services')} className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              What We Offer
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From finding your perfect car to keeping it in top condition, we offer comprehensive automotive solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`bg-card border-border hover:border-primary/50 transition-all duration-500 ${
                  visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section ref={observeSection('gallery')} className="py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Explore Our Space
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Photo Gallery
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a virtual tour of our showrooms, service centers, and stunning car collections.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ${
                  index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                } ${
                  visibleSections.has('gallery') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className={`${index === 0 || index === 5 ? 'aspect-square' : 'aspect-[4/3]'}`}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2">
                      {image.category}
                    </span>
                    <p className="text-white text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={observeSection('testimonials')} className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Customer Stories
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our valued customers who trusted us with their car-buying journey.
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className={`max-w-4xl mx-auto mb-12 transition-all duration-700 ${visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="bg-card border-border relative overflow-hidden">
              <div className="absolute top-6 left-6">
                <Quote className="w-12 h-12 text-primary/20" />
              </div>
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="shrink-0">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
                      <img
                        src={testimonials[currentTestimonial].image}
                        alt={testimonials[currentTestimonial].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-lg text-foreground mb-6 italic">
                      "{testimonials[currentTestimonial].review}"
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{testimonials[currentTestimonial].name}</p>
                      <p className="text-muted-foreground text-sm">
                        {testimonials[currentTestimonial].location} • {testimonials[currentTestimonial].car}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-center md:justify-end gap-2 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-primary' : 'bg-border hover:bg-muted-foreground'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <Card
                key={index}
                className={`bg-card border-border hover:border-primary/50 transition-all duration-500 ${
                  visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    "{testimonial.review}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.car}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Team Section */}
      <section ref={observeSection('team')} className="py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('team') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Meet The Experts
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals with decades of combined experience in the automotive industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  visibleSections.has('team') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-medium">{member.role}</p>
                <p className="text-muted-foreground text-sm mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={observeSection('timeline')} className="py-24 bg-muted/30">
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
                To make car ownership accessible, transparent, and joyful for every Indian. We strive to provide the best selection of vehicles, competitive pricing, and exceptional customer service that exceeds expectations. Every interaction with Auto Pulse should leave you feeling valued and confident in your decision.
              </p>
            </div>

            <div className={`p-8 bg-gradient-card rounded-2xl border border-border transition-all duration-700 delay-200 ${visibleSections.has('vision') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To be India's most trusted automotive partner, leading the transition to sustainable mobility while preserving the thrill of driving. We envision a future where every journey is powered by innovation and care, making Auto Pulse synonymous with automotive excellence across the nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section ref={observeSection('locations')} className="py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-700 ${visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-4">
              Visit Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Showroom Locations
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find an Auto Pulse showroom near you and experience our premium service firsthand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <Card
                key={index}
                className={`bg-card border-border hover:border-primary/50 transition-all duration-500 ${
                  visibleSections.has('locations') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-3">{location.city}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground flex items-start gap-2">
                      <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                      {location.address}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 shrink-0" />
                      {location.phone}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" />
                      10 AM - 8 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={observeSection('cta')} className="py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Find Your Dream Car?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Visit our showroom or browse our online collection. Our experts are here to help you make the perfect choice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/cars"
                className="inline-flex items-center justify-center px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-background/90 transition-colors"
              >
                Browse Cars
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
