import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Fuel, Settings, Users, Gauge, Calendar, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cars, formatPrice } from '@/data/cars';

const CarDetails = () => {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car not found</h1>
          <Button variant="hero" asChild>
            <Link to="/cars">Back to Cars</Link>
          </Button>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Fuel, label: 'Fuel Type', value: car.fuel },
    { icon: Settings, label: 'Transmission', value: car.transmission },
    { icon: Gauge, label: 'Mileage', value: car.mileage },
    { icon: Users, label: 'Seating', value: `${car.seating} Persons` },
    { icon: Zap, label: 'Power', value: car.power },
    { icon: Calendar, label: 'Year', value: car.year.toString() },
  ];

  const features = [
    'Touchscreen Infotainment',
    'Apple CarPlay & Android Auto',
    'Dual-zone Climate Control',
    'LED Headlamps',
    'Alloy Wheels',
    'Rear Parking Camera',
    'Cruise Control',
    'Keyless Entry',
    'ABS with EBD',
    'Multiple Airbags',
  ];

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cars</span>
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <div className="animate-fade-up">
            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-semibold rounded-full border border-primary/30">
              {car.category}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mt-4">
              {car.brand} <span className="text-gradient-gold">{car.model}</span>
            </h1>
            <p className="text-3xl font-bold text-foreground mt-4">
              {formatPrice(car.price)}
              <span className="text-muted-foreground text-lg font-normal ml-2">onwards</span>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Specifications */}
            <section className="animate-fade-up">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specs.map((spec, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-card rounded-xl border border-border"
                  >
                    <spec.icon className="w-6 h-6 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">{spec.label}</p>
                    <p className="text-lg font-semibold text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Features */}
            <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Key Features
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Engine Details */}
            <section className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Engine Details
              </h2>
              <div className="bg-gradient-card rounded-xl border border-border p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Engine Capacity</p>
                    <p className="text-xl font-semibold text-foreground">{car.engine}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Power</p>
                    <p className="text-xl font-semibold text-foreground">{car.power}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - CTA Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-gradient-card rounded-2xl border border-border p-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Interested in this car?
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Book a test drive or contact us for more information.
              </p>

              <div className="space-y-4">
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/contact">Book Test Drive</Link>
                </Button>
                <Button variant="heroOutline" size="lg" className="w-full" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Starting Price</p>
                <p className="text-3xl font-bold text-gradient-gold">
                  {formatPrice(car.price)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  *Ex-showroom price, Mumbai
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Available for immediate delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CarDetails;
