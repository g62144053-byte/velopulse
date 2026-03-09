import { HeroSection } from '@/components/HeroSection';
import { FeaturedCars } from '@/components/FeaturedCars';
import { BrandsSection } from '@/components/BrandsSection';
import { CTASection } from '@/components/CTASection';
import { RecentlyViewedCars } from '@/components/RecentlyViewedCars';
import { SellCarCTA } from '@/components/SellCarCTA';

const Index = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <BrandsSection />
      <FeaturedCars />
      <SellCarCTA />
      <RecentlyViewedCars />
      <CTASection />
    </main>
  );
};

export default Index;
