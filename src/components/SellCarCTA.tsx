import { Link } from 'react-router-dom';
import { DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SellCarCTA = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-card to-accent/10 border border-border p-8 md:p-12 lg:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <DollarSign className="w-4 h-4" />
                New Feature
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
                Ready to Sell Your Car?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                List your vehicle with us and reach thousands of verified buyers. Get the best price with our hassle-free selling process.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button asChild size="lg" className="text-lg px-8 py-6 group">
                <Link to="/sell-car">
                  Sell Your Car
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
